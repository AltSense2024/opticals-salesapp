const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

// 🪄 Set up SVG transformer
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

module.exports = withNativeWind(config, { input: "./global.css" });
