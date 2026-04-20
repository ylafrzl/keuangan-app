"use strict";(()=>{var e={};e.id=701,e.ids=[701],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1017:e=>{e.exports=require("path")},8404:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>c,patchFetch:()=>L,requestAsyncStorage:()=>p,routeModule:()=>u,serverHooks:()=>N,staticGenerationAsyncStorage:()=>d});var a={};t.r(a),t.d(a,{GET:()=>T,POST:()=>E});var s=t(9303),n=t(8716),i=t(670),o=t(6785);async function T(){try{let e=(0,o.zA)().prepare("SELECT id, name, avatar, color, created_at FROM users ORDER BY created_at ASC").all();return Response.json({ok:!0,data:e})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}async function E(e){try{let{name:r,avatar:t,color:a,pin:s}=await e.json();if(!r?.trim())return Response.json({ok:!1,error:"Nama wajib diisi"},{status:400});if(!s||s.length<4)return Response.json({ok:!1,error:"PIN minimal 4 digit"},{status:400});let n=(0,o.zA)();if(n.prepare("SELECT id FROM users WHERE LOWER(name) = LOWER(?)").get(r.trim()))return Response.json({ok:!1,error:"Nama sudah digunakan"},{status:409});let i="u_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),T=r.trim().split(" ").map(e=>e[0]).join("").slice(0,2).toUpperCase();return n.prepare(`
      INSERT INTO users (id, name, avatar, color, pin_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(i,r.trim(),t||T,a||"#6366f1",(0,o.xM)(s),new Date().toISOString()),Response.json({ok:!0,data:{id:i,name:r.trim(),avatar:t||T,color:a||"#6366f1"}})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}let u=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/users/route",pathname:"/api/users",filename:"route",bundlePath:"app/api/users/route"},resolvedPagePath:"/Users/yulisafrizal/Work/javascript/keuangan-fixed/src/app/api/users/route.js",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:N}=u,c="/api/users/route";function L(){return(0,i.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:d})}},9303:(e,r,t)=>{e.exports=t(517)},6785:(e,r,t)=>{t.d(r,{zA:()=>d,xM:()=>N,vj:()=>c});let a=require("better-sqlite3");var s=t.n(a),n=t(1017),i=t.n(n);let o=require("fs");var T=t.n(o);let E=require("crypto");var u=t.n(E);let p=null;function d(){return p||((p=new(s())(function(){let e=process.env.DB_PATH?process.env.DB_PATH:i().join(process.cwd(),"data");return T().existsSync(e)||T().mkdirSync(e,{recursive:!0}),i().join(e,"keuangan.db")}())).pragma("journal_mode = WAL"),p.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `);try{e.prepare("PRAGMA table_info(entries)").all().map(e=>e.name).includes("user_id")}catch(e){}}(p)),p}function N(e){return u().createHash("sha256").update("keuangan:"+e).digest("hex")}function c(e,r){return N(e)===r}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[948],()=>t(8404));module.exports=a})();