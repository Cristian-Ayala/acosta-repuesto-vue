'use strict';
module.exports = {
    pwa: {
        manifestOptions: {
            name: "Acosta Repuestos",
            short_name: "Acosta Repuestos",
            start_url: "./",
            display: "standalone",
            theme_color: "#ffffff",
            icons: [{
                    'src': './img/icons/192x192.png',
                    'sizes': '192x192',
                    'type': 'image/png',
                },
                {
                    src: "./img/icons/512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any maskable",
                },
            ],
            iconPaths: {
                favicon32: './img/icons/32x32.png',
                favicon16: './img/icons/16x16.png',
            }
        },

        themeColor: "#dc3545",
        background_color: "#ffffff",
        msTileColor: "#ffffff",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "white",
        iconPaths: {
            maskicon: null,
            favicon32: "./img/icons/favicon32.png",
            favicon16: "./img/iconss/favicon16.png",
            appleTouchIcon: null,
            msTileImage: null,
        },
        // configure the workbox plugin
        workboxPluginMode: "GenerateSW",
    },
};