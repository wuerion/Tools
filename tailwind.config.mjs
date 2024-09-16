/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./components/**/*.{astro,html,js,jsx,md,mdx.svelte,ts,tsx,vue}'
	],
	theme: {
		extend: {
			backgroundImage: {
				'pc': "radial-gradient(100% 500% at 50% 5%, #000 40%, #63e 120%)",
				'mv': "radial-gradient(100% 200% at 50% 5%, #000 20%, #63e 100%)",
				'w-pc': "radial-gradient(100% 500% at 50% 5%, #fff 40%, #63e 120%)",
				'w-mv': "radial-gradient(100% 200% at 50% 5%, #fff 20%, #63e 100%)",
			},
		},
	},
	plugins: [],
}
