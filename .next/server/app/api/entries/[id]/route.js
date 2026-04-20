"use strict";(()=>{var e={};e.id=13,e.ids=[13],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1017:e=>{e.exports=require("path")},6174:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>N,patchFetch:()=>L,requestAsyncStorage:()=>o,routeModule:()=>u,serverHooks:()=>p,staticGenerationAsyncStorage:()=>d});var n={};t.r(n),t.d(n,{DELETE:()=>E});var i=t(9303),s=t(8716),a=t(670),T=t(6785);async function E(e,{params:r}){try{let{id:t}=r,{searchParams:n}=new URL(e.url),i=n.get("userId"),s=(0,T.zA)(),a=i?s.prepare("DELETE FROM entries WHERE id = ? AND user_id = ?").run(t,i):s.prepare("DELETE FROM entries WHERE id = ?").run(t);if(0===a.changes)return Response.json({ok:!1,error:"Entry tidak ditemukan"},{status:404});return Response.json({ok:!0})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}let u=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/entries/[id]/route",pathname:"/api/entries/[id]",filename:"route",bundlePath:"app/api/entries/[id]/route"},resolvedPagePath:"/Users/yulisafrizal/Work/javascript/keuangan-fixed/src/app/api/entries/[id]/route.js",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:o,staticGenerationAsyncStorage:d,serverHooks:p}=u,N="/api/entries/[id]/route";function L(){return(0,a.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:d})}},9303:(e,r,t)=>{e.exports=t(517)},6785:(e,r,t)=>{t.d(r,{zA:()=>p,xM:()=>N,vj:()=>L});let n=require("better-sqlite3");var i=t.n(n),s=t(1017),a=t.n(s);let T=require("fs");var E=t.n(T);let u=require("crypto");var o=t.n(u);let d=null;function p(){return d||((d=new(i())(function(){let e=process.env.DB_PATH?process.env.DB_PATH:a().join(process.cwd(),"data");return E().existsSync(e)||E().mkdirSync(e,{recursive:!0}),a().join(e,"keuangan.db")}())).pragma("journal_mode = WAL"),d.pragma("foreign_keys = ON"),function(e){e.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      avatar     TEXT NOT NULL DEFAULT 'A',
      color      TEXT NOT NULL DEFAULT '#6366f1',
      pin_hash   TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entries (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      cat_id     TEXT NOT NULL,
      name       TEXT NOT NULL,
      amount     INTEGER NOT NULL DEFAULT 0,
      note       TEXT DEFAULT '',
      period     TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_period  ON entries(period);
    CREATE INDEX IF NOT EXISTS idx_entries_cat     ON entries(cat_id);
    CREATE INDEX IF NOT EXISTS idx_entries_user    ON entries(user_id);

    CREATE TABLE IF NOT EXISTS remarks (
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      period     TEXT NOT NULL,
      content    TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, period)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `);try{e.prepare("PRAGMA table_info(entries)").all().map(e=>e.name).includes("user_id")}catch(e){}}(d)),d}function N(e){return o().createHash("sha256").update("keuangan:"+e).digest("hex")}function L(e,r){return N(e)===r}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[948],()=>t(6174));module.exports=n})();