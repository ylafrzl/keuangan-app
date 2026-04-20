"use strict";(()=>{var e={};e.id=299,e.ids=[299],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1017:e=>{e.exports=require("path")},3246:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>c,patchFetch:()=>L,requestAsyncStorage:()=>d,routeModule:()=>u,serverHooks:()=>N,staticGenerationAsyncStorage:()=>p});var s={};t.r(s),t.d(s,{GET:()=>o,PUT:()=>E});var a=t(9303),n=t(8716),i=t(670),T=t(6785);async function o(e){try{let{searchParams:r}=new URL(e.url),t=r.get("period"),s=r.get("userId"),a=(0,T.zA)();if(!s)return Response.json({ok:!1,error:"userId wajib"},{status:400});if(t){let e=a.prepare("SELECT * FROM remarks WHERE user_id = ? AND period = ?").get(s,t);return Response.json({ok:!0,data:e||null})}let n=a.prepare("SELECT * FROM remarks WHERE user_id = ? ORDER BY period DESC").all(s);return Response.json({ok:!0,data:n})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}async function E(e){try{let{userId:r,period:t,content:s}=await e.json();if(!r||!t)return Response.json({ok:!1,error:"userId dan period wajib"},{status:400});return(0,T.zA)().prepare(`
      INSERT INTO remarks (user_id, period, content, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, period) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at
    `).run(r,t,s||"",new Date().toISOString()),Response.json({ok:!0})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}let u=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/remarks/route",pathname:"/api/remarks",filename:"route",bundlePath:"app/api/remarks/route"},resolvedPagePath:"/Users/yulisafrizal/Work/javascript/keuangan-fixed/src/app/api/remarks/route.js",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:p,serverHooks:N}=u,c="/api/remarks/route";function L(){return(0,i.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:p})}},9303:(e,r,t)=>{e.exports=t(517)},6785:(e,r,t)=>{t.d(r,{zA:()=>p,xM:()=>N,vj:()=>c});let s=require("better-sqlite3");var a=t.n(s),n=t(1017),i=t.n(n);let T=require("fs");var o=t.n(T);let E=require("crypto");var u=t.n(E);let d=null;function p(){return d||((d=new(a())(function(){let e=process.env.DB_PATH?process.env.DB_PATH:i().join(process.cwd(),"data");return o().existsSync(e)||o().mkdirSync(e,{recursive:!0}),i().join(e,"keuangan.db")}())).pragma("journal_mode = WAL"),d.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `);try{e.prepare("PRAGMA table_info(entries)").all().map(e=>e.name).includes("user_id")}catch(e){}}(d)),d}function N(e){return u().createHash("sha256").update("keuangan:"+e).digest("hex")}function c(e,r){return N(e)===r}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[948],()=>t(3246));module.exports=s})();