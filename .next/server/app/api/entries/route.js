"use strict";(()=>{var e={};e.id=678,e.ids=[678],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1017:e=>{e.exports=require("path")},2973:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>c,patchFetch:()=>L,requestAsyncStorage:()=>d,routeModule:()=>u,serverHooks:()=>N,staticGenerationAsyncStorage:()=>p});var n={};t.r(n),t.d(n,{GET:()=>o,POST:()=>E});var s=t(9303),a=t(8716),i=t(670),T=t(6785);async function o(e){try{let{searchParams:r}=new URL(e.url),t=r.get("period"),n=r.get("userId"),s=(0,T.zA)();if(!n)return Response.json({ok:!1,error:"userId wajib"},{status:400});let a=t?s.prepare("SELECT * FROM entries WHERE user_id = ? AND period = ? ORDER BY created_at ASC").all(n,t):s.prepare("SELECT * FROM entries WHERE user_id = ? ORDER BY period DESC, created_at ASC").all(n);return Response.json({ok:!0,data:a})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}async function E(e){try{let{id:r,userId:t,catId:n,name:s,amount:a,note:i,period:o}=await e.json();if(!r||!t||!n||!s||!a||!o)return Response.json({ok:!1,error:"Field tidak lengkap"},{status:400});let E=(0,T.zA)();if(!E.prepare("SELECT id FROM users WHERE id = ?").get(t))return Response.json({ok:!1,error:"User tidak ditemukan"},{status:404});return E.prepare(`
      INSERT INTO entries (id, user_id, cat_id, name, amount, note, period, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(r,t,n,s,a,i||"",o,new Date().toISOString()),Response.json({ok:!0})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}let u=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/entries/route",pathname:"/api/entries",filename:"route",bundlePath:"app/api/entries/route"},resolvedPagePath:"/Users/yulisafrizal/Work/javascript/keuangan-fixed/src/app/api/entries/route.js",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:d,staticGenerationAsyncStorage:p,serverHooks:N}=u,c="/api/entries/route";function L(){return(0,i.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:p})}},9303:(e,r,t)=>{e.exports=t(517)},6785:(e,r,t)=>{t.d(r,{zA:()=>p,xM:()=>N,vj:()=>c});let n=require("better-sqlite3");var s=t.n(n),a=t(1017),i=t.n(a);let T=require("fs");var o=t.n(T);let E=require("crypto");var u=t.n(E);let d=null;function p(){return d||((d=new(s())(function(){let e=process.env.DB_PATH?process.env.DB_PATH:i().join(process.cwd(),"data");return o().existsSync(e)||o().mkdirSync(e,{recursive:!0}),i().join(e,"keuangan.db")}())).pragma("journal_mode = WAL"),d.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `);try{e.prepare("PRAGMA table_info(entries)").all().map(e=>e.name).includes("user_id")}catch(e){}}(d)),d}function N(e){return u().createHash("sha256").update("keuangan:"+e).digest("hex")}function c(e,r){return N(e)===r}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[948],()=>t(2973));module.exports=n})();