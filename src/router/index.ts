import { createRouter, createWebHistory } from 'vue-router'
import { examples } from '@/examples/registry'
import ExampleView from '@/views/ExampleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: `/${examples[0]!.slug}` },
    {
      path: '/:slug',
      name: 'example',
      component: ExampleView,
      props: true,
      beforeEnter: (to) =>
        examples.some((e) => e.slug === to.params.slug) ? true : `/${examples[0]!.slug}`,
    },
  ],
})

export default router
