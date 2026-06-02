"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const withYomoneySdk = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        async (config) => {
            const podfilePath = path_1.default.join(config.modRequest.platformProjectRoot, "Podfile");
            try {
                let contents = await promises_1.default.readFile(podfilePath, "utf8");
                const projectName = config_plugins_1.IOSConfig.XcodeUtils.getProjectName(config.modRequest.projectRoot);
                contents = addCustomPod(contents, projectName);
                await promises_1.default.writeFile(podfilePath, contents);
                console.log("✅ Successfully added custom pod to Podfile");
            }
            catch (error) {
                console.warn("⚠️ Podfile not found, skipping modification");
            }
            return config;
        },
    ]);
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
    return contents.replace(targetRegex, `$1\n  pod 'YooKassaPayments', '~> 10.0.1'`);
}
exports.default = withYomoneySdk;
