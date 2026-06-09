import {
  AndroidConfig,
  ConfigPlugin,
  IOSConfig,
  withAndroidManifest,
  withDangerousMod,
} from "expo/config-plugins";
import fs from "fs/promises";
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

  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "MY_CUSTOM_API_KEY",
      "apiKey",
    );
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

  const podDeclaration = `pod 'YooKassaPayments', :git => 'https://git.yoomoney.ru/scm/sdk/yookassa-payments-swift.git', :tag => '10.0.1'`;

  return contents.replace(targetRegex, `$1\n  ${podDeclaration}`);
}

export default withYomoneySdk;
