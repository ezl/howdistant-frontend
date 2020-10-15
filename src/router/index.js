import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "@/views/Landing.vue";

import Survey from "@/views/surveys/Survey.vue";
import Name from "@/views/surveys/Name.vue";
import Questions from "@/views/surveys/Questions.vue";
import Complete from "@/views/surveys/Complete.vue";
import InviteSent from "@/views/surveys/InviteSent.vue";
import Summary from "@/views/surveys/Summary.vue";

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
        path: "/:id",
        name: "invited",
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
          showBackButton: false
        }
      },
      {
        name: "invite_sent",
        path: "invite_sent",
        component: InviteSent,
        meta: {
          label: () => "",
          showBackButton: false
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
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes
});

export default router;
