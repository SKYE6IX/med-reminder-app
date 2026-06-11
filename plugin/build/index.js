"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const fs_1 = require("fs");
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const withYomoneySdk = (config) => {
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (config) => {
            const podfilePath = path_1.default.join(config.modRequest.platformProjectRoot, "Podfile");
            try {
                let contents = await fs.readFile(podfilePath, "utf8");
                const projectName = config_plugins_1.IOSConfig.XcodeUtils.getProjectName(config.modRequest.projectRoot);
                contents = addCustomPod(contents, projectName);
                await fs.writeFile(podfilePath, contents);
                console.log("✅ Successfully added custom pod to Podfile");
            }
            catch (error) {
                console.warn("⚠️ Podfile not found, skipping modification");
            }
            return config;
        },
    ]);
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
            const xmlDir = path_1.default.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
            if (!(0, fs_1.existsSync)(xmlDir)) {
                (0, fs_1.mkdirSync)(xmlDir, { recursive: true });
            }
            const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">certs.yoomoney.ru</domain>
    </domain-config>
</network-security-config>`;
            (0, fs_1.writeFileSync)(path_1.default.join(xmlDir, "ym_network_security_config.xml"), xmlContent, "utf-8");
            return config;
        },
    ]);
    // Modify Xcodebuild.
    config = (0, config_plugins_1.withXcodeProject)(config, (config) => {
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
function addCustomPod(contents, projectName) {
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
    const targetRegex = new RegExp(`(target ['"]${projectName}['"] do[\\s\\S]*?use_expo_modules!)`, "m");
    const podDeclaration = `pod 'YooKassaPayments'`;
    contents = contents.replace(targetRegex, `$1\n  ${podDeclaration}`);
    if (!contents.includes("SWIFT_ENABLE_EXPLICIT_MODULES")) {
        contents = contents.replace(/post_install do \|installer\|/, `post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_ENABLE_EXPLICIT_MODULES'] = 'NO'
    end
  end`);
    }
    return contents;
}
exports.default = withYomoneySdk;
