import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "@/views/Landing.vue";
import Survey from "@/views/Survey.vue";
import Name from "@/views/Name.vue";
import Questions from "@/views/Questions.vue";
import Complete from "@/views/Complete.vue";
import Summary from "@/views/Summary.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing
  },
  {
    path: "/survey",
    name: "survey",
    component: Survey,
    children: [
      {
        name: "name",
        path: "name",
        component: Name,
        meta: {
          label: () => "What's your name?"
        }
      },
      {
        name: "questions",
        path: "questions",
        component: Questions,
        meta: {
          label(vm) {
            return `${`${vm.$route.hash.replace("#", "") || 1}`} of ${
              vm.$parent.questions.length
            }`;
          }
        }
      },
      {
        name: "complete",
        path: "complete",
        component: Complete,
        meta: {
          label: () => "",
          showBackButton: false,
          showCloseButton: true
        }
      },
      {
        name: "summary",
        path: ":id/summary",
        component: Summary,
        meta: {
          label: () => "Here’s how your group responded",
          showBackButton: false,
          showCloseButton: false,
          showExportButton: true,
          showGroupButton: true
        }
      }
    ]
  },
  {
    path: "/:id",
    name: "invited",
    component: Landing
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
