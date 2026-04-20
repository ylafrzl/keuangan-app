"use strict";(()=>{var e={};e.id=711,e.ids=[711],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1017:e=>{e.exports=require("path")},8468:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>N,patchFetch:()=>L,requestAsyncStorage:()=>u,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>c});var a={};t.r(a),t.d(a,{GET:()=>E});var n=t(9303),i=t(8716),s=t(670),o=t(6785);let T={income:[{id:"main-income",label:"Main Income",type:"income",color:"main-income"},{id:"side-income",label:"Side Income",type:"income",color:"side-income"}],expense:[{id:"primary",label:"Primary",type:"expense",color:"primary"},{id:"secondary",label:"Secondary",type:"expense",color:"secondary"},{id:"tertiary",label:"Tertiary",type:"expense",color:"tertiary"}],savings:[{id:"loan",label:"Loan",type:"loan",color:"loan"},{id:"savings",label:"Savings",type:"savings",color:"savings"}]},p=[...T.income,...T.expense,...T.savings];async function E(e){try{let{searchParams:r}=new URL(e.url),t=r.get("period"),a=r.get("userId"),n=(0,o.zA)();if(!a)return Response.json({ok:!1,error:"userId wajib"},{status:400});let i=t?n.prepare("SELECT * FROM entries WHERE user_id = ? AND period = ? ORDER BY created_at ASC").all(a,t):n.prepare("SELECT * FROM entries WHERE user_id = ? ORDER BY period ASC, created_at ASC").all(a),s=t?n.prepare("SELECT content FROM remarks WHERE user_id = ? AND period = ?").get(a,t):null,T=[["Periode","Kategori","Nama","Jumlah","Catatan","Waktu"]];i.forEach(e=>{let r=p.find(r=>r.id===e.cat_id);T.push([e.period,r?.label||e.cat_id,e.name,e.amount,e.note,e.created_at])}),s?.content&&(T.push([""]),T.push(["--- Catatan Bulan ---","","","","",""]),T.push([t,"Remark",s.content,"","",""]));let E=T.map(e=>e.map(e=>`"${String(e??"").replace(/"/g,'""')}"`).join(",")).join("\n");return new Response(E,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="keuangan_${t||"all"}.csv"`}})}catch(e){return Response.json({ok:!1,error:e.message},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/export/route",pathname:"/api/export",filename:"route",bundlePath:"app/api/export/route"},resolvedPagePath:"/Users/yulisafrizal/Work/javascript/keuangan-fixed/src/app/api/export/route.js",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:u,staticGenerationAsyncStorage:c,serverHooks:l}=d,N="/api/export/route";function L(){return(0,s.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:c})}},9303:(e,r,t)=>{e.exports=t(517)},6785:(e,r,t)=>{t.d(r,{zA:()=>u,xM:()=>c,vj:()=>l});let a=require("better-sqlite3");var n=t.n(a),i=t(1017),s=t.n(i);let o=require("fs");var T=t.n(o);let p=require("crypto");var E=t.n(p);let d=null;function u(){return d||((d=new(n())(function(){let e=process.env.DB_PATH?process.env.DB_PATH:s().join(process.cwd(),"data");return T().existsSync(e)||T().mkdirSync(e,{recursive:!0}),s().join(e,"keuangan.db")}())).pragma("journal_mode = WAL"),d.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `);try{e.prepare("PRAGMA table_info(entries)").all().map(e=>e.name).includes("user_id")}catch(e){}}(d)),d}function c(e){return E().createHash("sha256").update("keuangan:"+e).digest("hex")}function l(e,r){return c(e)===r}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[948],()=>t(8468));module.exports=a})();