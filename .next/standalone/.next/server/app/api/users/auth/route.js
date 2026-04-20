"use strict";(()=>{var e={};e.id=631,e.ids=[631],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1017:e=>{e.exports=require("path")},7323:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>N,patchFetch:()=>L,requestAsyncStorage:()=>E,routeModule:()=>u,serverHooks:()=>p,staticGenerationAsyncStorage:()=>d});var a={};t.r(a),t.d(a,{POST:()=>o});var s=t(9303),n=t(8716),i=t(670),T=t(6785);async function o(e){try{let{userId:r,pin:t}=await e.json();if(!r||!t)return Response.json({ok:!1,error:"userId dan pin wajib diisi"},{status:400});let a=(0,T.zA)().prepare("SELECT * FROM users WHERE id = ?").get(r);if(!a)return Response.json({ok:!1,error:"User tidak ditemukan"},{status:404});if(!(0,T.vj)(t,a.pin_hash))return Response.json({ok:!1,error:"PIN salah"},{status:401});return Response.json({ok:!0,data:{id:a.id,name:a.name,avatar:a.avatar,color:a.color}})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}let u=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/users/auth/route",pathname:"/api/users/auth",filename:"route",bundlePath:"app/api/users/auth/route"},resolvedPagePath:"/Users/yulisafrizal/Work/javascript/keuangan-fixed/src/app/api/users/auth/route.js",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:E,staticGenerationAsyncStorage:d,serverHooks:p}=u,N="/api/users/auth/route";function L(){return(0,i.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:d})}},9303:(e,r,t)=>{e.exports=t(517)},6785:(e,r,t)=>{t.d(r,{zA:()=>p,xM:()=>N,vj:()=>L});let a=require("better-sqlite3");var s=t.n(a),n=t(1017),i=t.n(n);let T=require("fs");var o=t.n(T);let u=require("crypto");var E=t.n(u);let d=null;function p(){return d||((d=new(s())(function(){let e=process.env.DB_PATH?process.env.DB_PATH:i().join(process.cwd(),"data");return o().existsSync(e)||o().mkdirSync(e,{recursive:!0}),i().join(e,"keuangan.db")}())).pragma("journal_mode = WAL"),d.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `);try{e.prepare("PRAGMA table_info(entries)").all().map(e=>e.name).includes("user_id")}catch(e){}}(d)),d}function N(e){return E().createHash("sha256").update("keuangan:"+e).digest("hex")}function L(e,r){return N(e)===r}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[948],()=>t(7323));module.exports=a})();