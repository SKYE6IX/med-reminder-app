"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const withYomoneySdk = (config) => {
    // config = withDangerousMod(config, [
    //   "ios",
    //   async (config) => {
    //     const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
    //     try {
    //       let contents = await fs.readFile(podfilePath, "utf8");
    //       const projectName = IOSConfig.XcodeUtils.getProjectName(config.modRequest.projectRoot);
    //       contents = addCustomPod(contents, projectName);
    //       await fs.writeFile(podfilePath, contents);
    //       console.log("✅ Successfully added custom pod to Podfile");
    //     } catch (error) {
    //       console.warn("⚠️ Podfile not found, skipping modification");
    //     }
    //     return config;
    //   },
    // ]);
    // Config Manifest
    config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const mainApplication = config_plugins_1.AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
        mainApplication.$["android:networkSecurityConfig"] = "@xml/ym_network_security_config";
        mainApplication.$["android:usesCleartextTraffic"] = "true";
        return config;
    });
    // Write yoomoney network config
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            const xmlDir = node_path_1.default.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
            if (!node_fs_1.default.existsSync(xmlDir)) {
                node_fs_1.default.mkdirSync(xmlDir, { recursive: true });
            }
            const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">certs.yoomoney.ru</domain>
    </domain-config>
</network-security-config>`;
            node_fs_1.default.writeFileSync(node_path_1.default.join(xmlDir, "ym_network_security_config.xml"), xmlContent, "utf-8");
            return config;
        },
    ]);
    return config;
};
// function addCustomPod(contents: string, projectName: string): string {
//   const sources = [
//     "source 'https://github.com/CocoaPods/Specs.git'",
//     "source 'https://git.yoomoney.ru/scm/sdk/cocoa-pod-specs.git'",
//   ];
//   for (const source of sources) {
//     if (!contents.includes(source)) {
//       contents = `${source}\n${contents}`;
//     }
//   }
//   if (contents.includes("pod 'YooKassaPayments'")) {
//     console.log("YooKassaPayments pod already exists, skipping");
//     return contents;
//   }
//   const targetRegex = new RegExp(
//     `(target ['"]${projectName}['"] do[\\s\\S]*?use_expo_modules!)`,
//     "m",
//   );
//   const podDeclaration = `pod 'YooKassaPayments', :git => 'https://git.yoomoney.ru/scm/sdk/yookassa-payments-swift.git', :tag => '10.0.1'`;
//   return contents.replace(targetRegex, `$1\n  ${podDeclaration}`);
// }
exports.default = withYomoneySdk;
