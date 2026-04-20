"use strict";(()=>{var e={};e.id=380,e.ids=[380],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1017:e=>{e.exports=require("path")},8095:(e,r,s)=>{s.r(r),s.d(r,{originalPathname:()=>L,patchFetch:()=>c,requestAsyncStorage:()=>p,routeModule:()=>o,serverHooks:()=>N,staticGenerationAsyncStorage:()=>d});var t={};s.r(t),s.d(t,{DELETE:()=>E,PATCH:()=>T});var a=s(9303),n=s(8716),i=s(670),u=s(6785);async function E(e,{params:r}){try{let{pin:s}=await e.json(),{id:t}=r,a=(0,u.zA)(),n=a.prepare("SELECT * FROM users WHERE id = ?").get(t);if(!n)return Response.json({ok:!1,error:"User tidak ditemukan"},{status:404});if(!(0,u.vj)(s,n.pin_hash))return Response.json({ok:!1,error:"PIN salah"},{status:401});return a.prepare("DELETE FROM users WHERE id = ?").run(t),Response.json({ok:!0})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}async function T(e,{params:r}){try{let{pin:s,name:t,avatar:a,color:n,newPin:i}=await e.json(),{id:E}=r,T=(0,u.zA)(),o=T.prepare("SELECT * FROM users WHERE id = ?").get(E);if(!o)return Response.json({ok:!1,error:"User tidak ditemukan"},{status:404});if(!(0,u.vj)(s,o.pin_hash))return Response.json({ok:!1,error:"PIN salah"},{status:401});let p=[],d=[];t&&(p.push("name = ?"),d.push(t.trim())),a&&(p.push("avatar = ?"),d.push(a)),n&&(p.push("color = ?"),d.push(n)),i&&i.length>=4&&(p.push("pin_hash = ?"),d.push((0,u.xM)(i))),p.length&&(d.push(E),T.prepare(`UPDATE users SET ${p.join(", ")} WHERE id = ?`).run(...d));let N=T.prepare("SELECT id, name, avatar, color FROM users WHERE id = ?").get(E);return Response.json({ok:!0,data:N})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}let o=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/users/[id]/route",pathname:"/api/users/[id]",filename:"route",bundlePath:"app/api/users/[id]/route"},resolvedPagePath:"/Users/yulisafrizal/Work/javascript/keuangan-fixed/src/app/api/users/[id]/route.js",nextConfigOutput:"standalone",userland:t}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:N}=o,L="/api/users/[id]/route";function c(){return(0,i.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:d})}},9303:(e,r,s)=>{e.exports=s(517)},6785:(e,r,s)=>{s.d(r,{zA:()=>d,xM:()=>N,vj:()=>L});let t=require("better-sqlite3");var a=s.n(t),n=s(1017),i=s.n(n);let u=require("fs");var E=s.n(u);let T=require("crypto");var o=s.n(T);let p=null;function d(){return p||((p=new(a())(function(){let e=process.env.DB_PATH?process.env.DB_PATH:i().join(process.cwd(),"data");return E().existsSync(e)||E().mkdirSync(e,{recursive:!0}),i().join(e,"keuangan.db")}())).pragma("journal_mode = WAL"),p.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `);try{e.prepare("PRAGMA table_info(entries)").all().map(e=>e.name).includes("user_id")}catch(e){}}(p)),p}function N(e){return o().createHash("sha256").update("keuangan:"+e).digest("hex")}function L(e,r){return N(e)===r}}};var r=require("../../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[948],()=>s(8095));module.exports=t})();