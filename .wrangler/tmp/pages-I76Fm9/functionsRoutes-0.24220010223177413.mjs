import { onRequestPost as __api_private_schools_bulk_ts_onRequestPost } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\private_schools\\bulk.ts"
import { onRequestPost as __api_special_courses_bulk_ts_onRequestPost } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\special_courses\\bulk.ts"
import { onRequestPost as __api_teachers_bulk_ts_onRequestPost } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\teachers\\bulk.ts"
import { onRequestDelete as __api_challenges__id__ts_onRequestDelete } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\challenges\\[id].ts"
import { onRequestPut as __api_challenges__id__ts_onRequestPut } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\challenges\\[id].ts"
import { onRequestDelete as __api_courses__id__ts_onRequestDelete } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\courses\\[id].ts"
import { onRequestPut as __api_courses__id__ts_onRequestPut } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\courses\\[id].ts"
import { onRequestDelete as __api_private_schools__id__ts_onRequestDelete } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\private_schools\\[id].ts"
import { onRequestPut as __api_private_schools__id__ts_onRequestPut } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\private_schools\\[id].ts"
import { onRequestDelete as __api_special_courses__id__ts_onRequestDelete } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\special_courses\\[id].ts"
import { onRequestPut as __api_special_courses__id__ts_onRequestPut } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\special_courses\\[id].ts"
import { onRequestDelete as __api_teachers__id__ts_onRequestDelete } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\teachers\\[id].ts"
import { onRequestPut as __api_teachers__id__ts_onRequestPut } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\teachers\\[id].ts"
import { onRequestGet as __api_categories_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\categories.ts"
import { onRequestGet as __api_certificates_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\certificates.ts"
import { onRequestGet as __api_challenges_index_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\challenges\\index.ts"
import { onRequestPost as __api_challenges_index_ts_onRequestPost } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\challenges\\index.ts"
import { onRequestGet as __api_courses_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\courses.ts"
import { onRequestGet as __api_employees_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\employees.ts"
import { onRequestPost as __api_gemini_ts_onRequestPost } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\gemini.ts"
import { onRequestGet as __api_schools_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\schools.ts"
import { onRequestGet as __api_special_courses_index_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\special_courses\\index.ts"
import { onRequestGet as __api_special_courses_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\special-courses.ts"
import { onRequestGet as __api_teachers_index_ts_onRequestGet } from "C:\\Users\\dell\\.gemini\\antigravity\\scratch\\i̇stanbul-egitim-merkezi-Antigravity\\functions\\api\\teachers\\index.ts"

export const routes = [
    {
      routePath: "/api/private_schools/bulk",
      mountPath: "/api/private_schools",
      method: "POST",
      middlewares: [],
      modules: [__api_private_schools_bulk_ts_onRequestPost],
    },
  {
      routePath: "/api/special_courses/bulk",
      mountPath: "/api/special_courses",
      method: "POST",
      middlewares: [],
      modules: [__api_special_courses_bulk_ts_onRequestPost],
    },
  {
      routePath: "/api/teachers/bulk",
      mountPath: "/api/teachers",
      method: "POST",
      middlewares: [],
      modules: [__api_teachers_bulk_ts_onRequestPost],
    },
  {
      routePath: "/api/challenges/:id",
      mountPath: "/api/challenges",
      method: "DELETE",
      middlewares: [],
      modules: [__api_challenges__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/challenges/:id",
      mountPath: "/api/challenges",
      method: "PUT",
      middlewares: [],
      modules: [__api_challenges__id__ts_onRequestPut],
    },
  {
      routePath: "/api/courses/:id",
      mountPath: "/api/courses",
      method: "DELETE",
      middlewares: [],
      modules: [__api_courses__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/courses/:id",
      mountPath: "/api/courses",
      method: "PUT",
      middlewares: [],
      modules: [__api_courses__id__ts_onRequestPut],
    },
  {
      routePath: "/api/private_schools/:id",
      mountPath: "/api/private_schools",
      method: "DELETE",
      middlewares: [],
      modules: [__api_private_schools__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/private_schools/:id",
      mountPath: "/api/private_schools",
      method: "PUT",
      middlewares: [],
      modules: [__api_private_schools__id__ts_onRequestPut],
    },
  {
      routePath: "/api/special_courses/:id",
      mountPath: "/api/special_courses",
      method: "DELETE",
      middlewares: [],
      modules: [__api_special_courses__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/special_courses/:id",
      mountPath: "/api/special_courses",
      method: "PUT",
      middlewares: [],
      modules: [__api_special_courses__id__ts_onRequestPut],
    },
  {
      routePath: "/api/teachers/:id",
      mountPath: "/api/teachers",
      method: "DELETE",
      middlewares: [],
      modules: [__api_teachers__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/teachers/:id",
      mountPath: "/api/teachers",
      method: "PUT",
      middlewares: [],
      modules: [__api_teachers__id__ts_onRequestPut],
    },
  {
      routePath: "/api/categories",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_categories_ts_onRequestGet],
    },
  {
      routePath: "/api/certificates",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_certificates_ts_onRequestGet],
    },
  {
      routePath: "/api/challenges",
      mountPath: "/api/challenges",
      method: "GET",
      middlewares: [],
      modules: [__api_challenges_index_ts_onRequestGet],
    },
  {
      routePath: "/api/challenges",
      mountPath: "/api/challenges",
      method: "POST",
      middlewares: [],
      modules: [__api_challenges_index_ts_onRequestPost],
    },
  {
      routePath: "/api/courses",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_courses_ts_onRequestGet],
    },
  {
      routePath: "/api/employees",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_employees_ts_onRequestGet],
    },
  {
      routePath: "/api/gemini",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_gemini_ts_onRequestPost],
    },
  {
      routePath: "/api/schools",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_schools_ts_onRequestGet],
    },
  {
      routePath: "/api/special_courses",
      mountPath: "/api/special_courses",
      method: "GET",
      middlewares: [],
      modules: [__api_special_courses_index_ts_onRequestGet],
    },
  {
      routePath: "/api/special-courses",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_special_courses_ts_onRequestGet],
    },
  {
      routePath: "/api/teachers",
      mountPath: "/api/teachers",
      method: "GET",
      middlewares: [],
      modules: [__api_teachers_index_ts_onRequestGet],
    },
  ]