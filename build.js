const fs=require('fs'),path=require('path');
const ok=/\.(jpe?g|png|webp)$/i;
let sharp=null;try{sharp=require('sharp')}catch(e){console.log('sharp not available, using original photos')}
const src=[];
for(const f of fs.readdirSync('.'))if(ok.test(f))src.push(f);
if(fs.existsSync('photos'))for(const f of fs.readdirSync('photos'))if(ok.test(f))src.push('photos/'+f);
fs.mkdirSync('thumbs',{recursive:true});fs.mkdirSync('medium',{recursive:true});
(async()=>{
  const out=[],used=new Set();
  for(const p of src){
    const base=path.basename(p).replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9_-]+/g,'-');
    let n=base,i=2;while(used.has(n))n=base+'-'+(i++);used.add(n);
    const label=base.replace(/[-_]+/g,' ');
    if(sharp){
      try{
        await sharp(p).rotate().resize({width:200,height:250,fit:'cover'}).jpeg({quality:65}).toFile('thumbs/'+n+'.jpg');
        await sharp(p).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).jpeg({quality:82}).toFile('medium/'+n+'.jpg');
        out.push({n:label,t:'thumbs/'+n+'.jpg',f:'medium/'+n+'.jpg'});continue;
      }catch(e){console.log('could not resize',p,e.message)}
    }
    out.push({n:label,t:p,f:p});
  }
  fs.writeFileSync('photos.json',JSON.stringify(out));
  console.log(out.length+' photos listed');
})();
