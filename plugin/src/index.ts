import {
  AndroidConfig,
  ConfigPlugin,
  IOSConfig,
  withAndroidManifest,
  withDangerousMod,
  withXcodeProject,
} from "expo/config-plugins";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import * as fs from "fs/promises";
import path from "path";

const withYomoneySdk: ConfigPlugin = (config) => {
  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");

      try {
        let contents = await fs.readFile(podfilePath, "utf8");
        const projectName = IOSConfig.XcodeUtils.getProjectName(config.modRequest.projectRoot);

        contents = addCustomPod(contents, projectName);

        await fs.writeFile(podfilePath, contents);

        console.log("✅ Successfully added custom pod to Podfile");
      } catch (error) {
        console.warn("⚠️ Podfile not found, skipping modification");
      }

      return config;
    },
  ]);

  // Config Manifest
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    mainApplication.$["android:networkSecurityConfig"] = "@xml/ym_network_security_config";
    mainApplication.$["android:usesCleartextTraffic"] = "true";
    return config;
  });

  // Write yoomoney network config
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const xmlDir = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
      if (!existsSync(xmlDir)) {
        mkdirSync(xmlDir, { recursive: true });
      }
      const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">certs.yoomoney.ru</domain>
    </domain-config>
</network-security-config>`;
      writeFileSync(path.join(xmlDir, "ym_network_security_config.xml"), xmlContent, "utf-8");
      return config;
    },
  ]);

  // Modify Xcodebuild.
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;

    const configurations = project.pbxXCBuildConfigurationSection();

    for (const key of Object.keys(configurations)) {
      const configItem = configurations[key];
      if (typeof configItem === "object" && configItem.buildSettings) {
        configItem.buildSettings.SWIFT_ENABLE_EXPLICIT_MODULES = "YES";
      }
    }

    return config;
  });

  return config;
};

function addCustomPod(contents: string, projectName: string): string {
  const sources = [
    "source 'https://github.com/CocoaPods/Specs.git'",
    "source 'https://git.yoomoney.ru/scm/sdk/cocoa-pod-specs.git'",
  ];

  for (const source of sources) {
    if (!contents.includes(source)) {
      contents = `${source}\n${contents}`;
    }
  }

  if (contents.includes("pod 'YooKassaPayments'")) {
    console.log("YooKassaPayments pod already exists, skipping");
    return contents;
  }

  const targetRegex = new RegExp(
    `(target ['"]${projectName}['"] do[\\s\\S]*?use_expo_modules!)`,
    "m",
  );

  const podDeclaration = `pod 'YooKassaPayments'`;

  contents = contents.replace(targetRegex, `$1\n  ${podDeclaration}`);

  if (!contents.includes("SWIFT_ENABLE_EXPLICIT_MODULES")) {
    contents = contents.replace(
      /post_install do \|installer\|/,
      `post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_ENABLE_EXPLICIT_MODULES'] = 'YES'
    end
  end`,
    );
  }
  return contents;
}

export default withYomoneySdk;
