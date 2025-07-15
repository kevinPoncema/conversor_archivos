const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',        // Permite conexiones externas
    port: 3000,             // Asegúrate que coincide con el puerto expuesto
    allowedHosts: 'all'     // Acepta cualquier cabecera 'Host' (como tu dominio)
  }
})
