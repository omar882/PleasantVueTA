import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	},
	// for linked package in dev
	build: {
		commonjsOptions: {
			include: [/studentvue\.js/g, /node_modules/g]
		}
	},
	optimizeDeps: {
		include: ['studentvue.js'],
	  },
}

export default config
