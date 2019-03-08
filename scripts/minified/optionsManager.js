const LOG={INFO:"info",DANGER:"danger",WARNING:"warning",SUCCESS:"success"};class OptionsManager{constructor(){this.addColorButton=document.getElementById("addColor"),this.saveButton=document.getElementById("save"),this.lastOpenColorsList=document.getElementById("lastOpenColors"),this.defaultLastOpenColors=document.getElementById("defaultLastOpenColors"),this.downloadSaveButton=document.getElementById("download-save"),this.refreshSaveButton=document.getElementById("refresh-save"),this.copySave=document.getElementById("copy-save"),this.saveContent=document.getElementById("save-content"),this.importMMDForm=document.getElementById("save-import"),this.importMALForm=document.getElementById("mal-import"),this.exportMALForm=document.getElementById("mal-export"),this.deleteSaveButton=document.getElementById("delete-save"),this.lastOpenColorsNodes={},this.importOutput=document.getElementById("malImportStatus"),this.exportOutput=document.getElementById("malExportStatus"),this.importInformations=document.getElementById("importInformations"),this.saveUploadButton=document.getElementById("saveUploadButton"),this.importSubmitButton=document.getElementById("importSubmitButton"),this.onlineOptions=document.getElementById("onlineOptions"),this.loggedInPanel=document.getElementById("loggedInPanel"),this.onlineAdvancedPanel=document.getElementById("onlineAdvancedPanel"),this.loggedOutPanel=document.getElementById("loggedOutPanel"),this.onlineForm=document.getElementById("onlineForm"),this.onlineError=document.getElementById("onlineError"),this.onlineSuccess=document.getElementById("onlineSuccess"),this.downloadOnlineButton=document.getElementById("downloadOnline"),CHROME?document.getElementById("onlineURLPanel").style.display="block":document.getElementById("onlineServiceInfo").style.display="block",this.options={},this.myAnimeListMangaList={},this.mangaDexMangaList=[],this.currentLog="import",this.malBusy=!1,this.loggedMyAnimeList=!0,this.HTMLParser=new DOMParser,this.setEvents(),this.start()}async start(){this.options=await loadOptions(),this.restoreOptions()}setEvents(){document.querySelectorAll("[data-color]").forEach(a=>{let b=a.dataset.option;["input","change","cut","paste","keyup"].forEach(function(c){a.addEventListener(c,a=>{document.querySelector("[data-color='"+b+"']").style.backgroundColor=a.target.value})})}),document.querySelectorAll("[data-type='checkbox']").forEach(a=>{let b=a.getElementsByTagName("button");b[0].addEventListener("click",()=>{this.updateCheckbox(a,!0)}),b[1].addEventListener("click",()=>{this.updateCheckbox(a,!1)})}),this.addColorButton.addEventListener("click",()=>{this.addColor()}),this.saveButton.addEventListener("click",()=>{this.saveOptions()}),document.querySelectorAll("[data-default]").forEach(a=>{a.addEventListener("click",()=>{let b=document.querySelector("[data-option='"+a.dataset.default+"']");"type"in b.dataset&&"checkbox"==b.dataset.type?this.updateCheckbox(b,defaultOptions[a.dataset.default]):(b.value=defaultOptions[a.dataset.default],b.dataset.color!==void 0&&(document.querySelector("[data-color='"+a.dataset.default+"']").style.backgroundColor=defaultOptions[a.dataset.default]))})}),this.defaultLastOpenColors.addEventListener("click",()=>{this.restoreDefaultsLastOpenColors()}),this.downloadSaveButton.addEventListener("click",async()=>{if(this.downloadSaveButton.dataset.busy===void 0){this.downloadSaveButton.dataset.busy=!0;let a=await storageGet(null);this.downloadSaveButton.href="data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(a)),this.downloadSaveButton.click(),this.downloadSaveButton.href="",delete this.downloadSaveButton.dataset.busy}}),this.refreshSaveButton.addEventListener("click",async()=>{this.copySave.classList.add("d-none");let a=await storageGet(null);this.saveContent.value=JSON.stringify(a),this.copySave.classList.remove("d-none")}),this.copySave.addEventListener("click",async()=>{this.copySave.classList.add("d-none"),this.saveContent.select(),document.execCommand("copy"),this.saveContent.value=""}),this.saveContent.addEventListener("click",a=>{a.target.select()}),this.importMMDForm.addEventListener("submit",a=>{a.preventDefault(),this.importMMD()}),this.importMALForm.addEventListener("submit",a=>{a.preventDefault(),this.importMAL()}),this.exportMALForm.addEventListener("submit",a=>{a.preventDefault(),this.exportMAL()}),this.deleteSaveButton.addEventListener("click",()=>void 0===this.deleteSaveButton.dataset.again?(this.deleteSaveButton.style.fontSize="2rem",this.deleteSaveButton.dataset.again=!0,void(this.deleteSaveButton.textContent="Click again to confirm")):void this.deleteSave()),this.onlineError.addEventListener("click",()=>{this.onlineError.style.display="none"}),this.onlineSuccess.addEventListener("click",()=>{this.onlineSuccess.style.display="none"}),document.querySelectorAll("[data-button-protect]").forEach(async a=>{a.addEventListener("click",this.protectButton.bind(this,a))});let a=document.querySelector("[data-option='onlineSave']");a.firstElementChild.firstElementChild.addEventListener("click",()=>{this.toggleOnlinePanels(!0)}),a.lastElementChild.lastElementChild.addEventListener("click",()=>{this.toggleOnlinePanels(!1)})}async protectButton(a){a.dataset.busy===void 0&&(a.dataset.busy=!0,await this[a.dataset.buttonProtect](),delete a.dataset.busy)}async restoreOptions(){let a=this.options.lastOpenColors;this.deleteLastOpenColors(),a.forEach(a=>{this.addColor(a)}),document.querySelectorAll("[data-option]").forEach(a=>{a.dataset.type!==void 0&&"checkbox"==a.dataset.type?this.updateCheckbox(a,this.options[a.dataset.option]):(a.value=this.options[a.dataset.option],a.dataset.color!==void 0&&(document.querySelector("[data-color='"+a.dataset.option+"']").style.backgroundColor=a.value))}),this.onlineForm.onlineURL.value=this.options.onlineURL,this.onlineForm.username.value=this.options.username,this.toggleOnlinePanels(this.options.onlineSave)}addColor(a=""){let b=uniqueGUID();for(;this.lastOpenColorsNodes[b]!==void 0;)b=uniqueGUID();let c=document.createElement("div");c.className="col px-0 pb-2 my-auto input-group";let d=document.createElement("div");d.className="input-group-prepend";let e=document.createElement("i");e.className="fas fa-trash";let f=document.createElement("a");f.className="btn btn-danger input-prepend",f.appendChild(e),f.appendChild(document.createTextNode(" Remove")),f.addEventListener("click",()=>{this.removeColor(b)}),d.appendChild(f),c.appendChild(d);let g=document.createElement("div");g.className="input-group-append";let h=document.createElement("span");h.className="input-group-text",h.style.backgroundColor=a,g.appendChild(h);let i=document.createElement("input");["input","change","cut","paste","keyup"].forEach(function(a){i.addEventListener(a,a=>{h.style.backgroundColor=a.target.value})}),i.type="text",i.className="form-control",i.value=a,this.lastOpenColorsNodes[b]={parent:c,input:i},c.appendChild(i),c.appendChild(g),this.lastOpenColorsList.insertBefore(c,this.lastOpenColorsList.lastElementChild)}removeColor(a){1<Object.keys(this.lastOpenColorsNodes).length&&(this.lastOpenColorsList.removeChild(this.lastOpenColorsNodes[a].parent),delete this.lastOpenColorsNodes[a])}deleteLastOpenColors(){for(;this.lastOpenColorsList.firstChild&&!("addColorRow"==this.lastOpenColorsList.firstChild.id);)this.lastOpenColorsList.removeChild(this.lastOpenColorsList.firstChild);this.lastOpenColorsNodes={}}restoreDefaultsLastOpenColors(){this.deleteLastOpenColors(),defaultOptions.lastOpenColors.forEach(a=>{this.addColor(a)})}updateCheckbox(a,b){a.dataset.value=b;let c=a.firstElementChild.firstElementChild,d=a.lastElementChild.lastElementChild;b?(c.classList.add("btn-success"),c.classList.remove("btn-secondary"),d.classList.add("btn-secondary"),d.classList.remove("btn-danger")):(c.classList.add("btn-secondary"),c.classList.remove("btn-success"),d.classList.add("btn-danger"),d.classList.remove("btn-secondary"))}flashBackground(a){document.body.classList.add(a?"bg-success":"bg-fail"),setTimeout(()=>{document.body.classList.remove(a?"bg-success":"bg-fail")},500)}async saveOptions(){try{this.options.lastOpenColors=[],Object.keys(this.lastOpenColorsNodes).forEach(a=>{this.options.lastOpenColors.push(this.lastOpenColorsNodes[a].input.value)}),document.querySelectorAll("[data-option]").forEach(a=>{this.options[a.dataset.option]="type"in a.dataset&&"checkbox"==a.dataset.type?"true"==a.dataset.value:a.value}),await storageSet("options",this.options),this.flashBackground(!0)}catch(a){console.error(a),this.flashBackground(!1)}}async deleteSave(){this.deleteSaveButton.style.fontSize="1rem",delete this.deleteSaveButton.dataset.again,this.deleteSaveButton.textContent="Delete",await browser.storage.local.clear();try{await storageSet("options",defaultOptions),this.options=JSON.parse(JSON.stringify(defaultOptions)),this.flashBackground(!0),this.restoreOptions()}catch(a){console.error(a),this.flashBackground(!1)}}logAndScroll(a,b){let c=document.createElement("li");c.className="list-group-item list-group-item-"+a,c.textContent=b,this.logOutput.appendChild(c),this.logOutput.scrollTop=this.logOutput.scrollHeight}importMMD(){try{if(this.saveUploadButton.files[0]!=null){var a=new FileReader;a.onload=()=>{this.importMMDForm.reset(),this.finishImportMMD(JSON.parse(a.result))},a.readAsText(this.saveUploadButton.files[0])}else this.finishImportMMD(JSON.parse(this.importMMDForm.save.value))}catch(a){return this.importSubmitButton.disabled=!1,this.flashBackground(!1),void console.error(a)}}async finishImportMMD(a){return(this.importSubmitButton.disabled=!0,isEmpty(a)||void 0===a.options)?(this.importInformations.textContent="Invalid save.",this.importSubmitButton.disabled=!1,void this.flashBackground(!1)):void(this.importInformations.textContent="Entries in the save: "+(Object.keys(a).length-1),await storageSet(null,a),this.options=await loadOptions(),await this.restoreOptions(),this.flashBackground(!0),this.importSubmitButton.disabled=!1,this.importMMDForm.save.value="")}async importMAL(){if(!this.malBusy){let a=this.importMALForm.username.value;this.importMALForm.disabled=!0,""==a?(this.flashBackground(!1),console.error("Empty MAL username")):(this.myAnimeListMangaList={},this.mangaDexMangaList=[],this.malBusy=!0,this.logOutput=this.importOutput,this.logOutput.style.display="block",clearDomNode(this.logOutput),this.logAndScroll(LOG.INFO,"Starting... don't close the options page."),await this.listMyAnimeList(a,0,!0),0==Object.keys(this.myAnimeListMangaList).length?(this.flashBackground(!1),this.logAndScroll(LOG.DANGER,"Empty MAL manga list, aborting.")):(await this.listMyAnimeList(a,Object.keys(this.myAnimeListMangaList).length),await this.listMangaDex(),await this.updateLocalFromMDMAL(),this.flashBackground(!0)),this.malBusy=!1)}}async listMyAnimeList(a,b=0,c=!1){if(0<b&&300>b)return void this.logAndScroll(LOG.SUCCESS,"Done fetching MyAnimeList manga.");this.logAndScroll(LOG.INFO,"Fetching MyAnimeList manga from "+b+" to "+(b+300));try{let d=await fetch("https://myanimelist.net/mangalist/"+a+"/load.json?offset="+b+"&status=7",{method:"GET",redirect:"follow",credentials:"include"}),e=await d.json();if(e.hasOwnProperty("errors"))this.logAndScroll(LOG.DANGER,e.errors[0].message);else{for(let a of e)this.myAnimeListMangaList[parseInt(a.manga_id)]=parseInt(a.num_read_chapters);c||(300==e.length?await this.listMyAnimeList(a,b+300):this.logAndScroll(LOG.SUCCESS,"Done fetching MyAnimeList manga."))}}catch(a){this.flashBackground(!1),console.error(a)}}async listMangaDex(a=1,b=1,c=0){this.logAndScroll(LOG.INFO,"Fetching MangaDex follow page manga "+a+(1<b?" of "+b:""));try{let d=await fetch("https://mangadex.org/follows/manga/"+c+"/0/"+a+"/",{method:"GET",redirect:"follow",credentials:"include"}),e=await d.text(),f=this.HTMLParser.parseFromString(e,"text/html"),g=f.querySelectorAll("a.manga_title");for(let a=0;a<g.length;a++)this.mangaDexMangaList.push(parseInt(/\/title\/(\d+)\//.exec(g[a].href)[1]));if(1==a){let a=f.querySelector(".mt-3.text-center");if(null!==a){let c=/Showing\s\d+\sto(\s\d+)\sof\s(\d+)\stitles/.exec(a.textContent);null!==c&&(b=Math.ceil(parseInt(c[2])/parseInt(c[1])))}}a<b?(await new Promise(a=>{setTimeout(()=>{a()},500)}),await this.listMangaDex(a+1,b,c)):this.logAndScroll(LOG.SUCCESS,"Done fetching MangaDex follow manga.")}catch(a){this.flashBackground(!1),console.error(a)}}async updateLocalFromMDMAL(a=0){var b=Math.max;this.logAndScroll(LOG.INFO,"Updating "+(a+1)+"/"+this.mangaDexMangaList.length),await new Promise(a=>{setTimeout(()=>{a()},500)});try{let c=await fetch("https://mangadex.org/title/"+this.mangaDexMangaList[a],{method:"GET",cache:"no-cache"}),d=await c.text(),e=this.HTMLParser.parseFromString(d,"text/html"),f={mangaDexId:this.mangaDexMangaList[a],myAnimeListId:0,lastMangaDexChapter:0,currentChapter:{volume:0,chapter:0},chapters:[]},g=e.querySelector("h6[class='card-header']").textContent.trim(),h=e.querySelector("img[src='/images/misc/mal.png'");if(null===h?f.myAnimeListId=0:(h=h.nextElementSibling,f.myAnimeListId=parseInt(/https:\/\/myanimelist\.net\/manga\/(\d+)/.exec(h.href)[1])),0==f.myAnimeListId){if(this.logAndScroll(LOG.WARNING,"> "+g+" set to Chapter 0 (No MyAnimeList entry)"),await updateLocalStorage(f,this.options),a++,a<this.mangaDexMangaList.length)return this.updateLocalFromMDMAL(a);this.logAndScroll(LOG.SUCCESS,"Done.")}else{if(f.myAnimeListId in this.myAnimeListMangaList&&(f.currentChapter.chapter=this.myAnimeListMangaList[f.myAnimeListId],this.options.saveAllOpened)){let a=b(f.currentChapter.chapter-this.options.maxChapterSaved,0);for(let b=f.currentChapter.chapter;b>a;b--)f.chapters.push(b)}if(this.logAndScroll(LOG.SUCCESS,"> "+g+" set to Chapter "+f.currentChapter.chapter),await updateLocalStorage(f,this.options),a++,a<this.mangaDexMangaList.length)return this.updateLocalFromMDMAL(a);this.logAndScroll(LOG.SUCCESS,"Done.")}}catch(b){this.flashBackground(!1),this.logAndScroll(LOG.DANGER,"Updating "+(a+1)+" Failed"),console.error(b),a++,a<this.mangaDexMangaList.length?await this.updateLocalFromMDMAL(a):this.logAndScroll(LOG.SUCCESS,"Done.")}}async exportMAL(){var a=Math.max;if(!this.malBusy){this.malBusy=!0,this.logOutput=this.exportOutput,this.logOutput.style.display="block",clearDomNode(this.logOutput),this.logAndScroll(LOG.INFO,"Starting... don't close the options page.");for(let b=1;6>=b;b++){await new Promise(a=>{setTimeout(()=>{a()},500)}),this.logAndScroll(LOG.INFO,"Updating manga with the status "+b),this.mangaDexMangaList=[],await this.listMangaDex(1,1,b);let c=this.mangaDexMangaList.length;if(0!=c){for(let d=0;d<c;d++){await new Promise(a=>{setTimeout(()=>{a()},500)}),this.logAndScroll(LOG.INFO,"Updating #"+this.mangaDexMangaList[d]);let c=await storageGet(this.mangaDexMangaList[d]),e=!1;if(null==c){e=!0,this.logAndScroll(LOG.INFO,"Trying to find a MyAnimeList id for #"+this.mangaDexMangaList[d]);let a=await fetch("https://mangadex.org/title/"+this.mangaDexMangaList[d],{method:"GET",cache:"no-cache"}),b=await a.text(),f=this.HTMLParser.parseFromString(b,"text/html");c={mal:0,last:0,chapters:[]};let g=f.querySelector("img[src='/images/misc/mal.png'");null!==g&&(g=g.nextElementSibling,c.mal=parseInt(/https:\/\/myanimelist\.net\/manga\/(\d+)/.exec(g.href)[1]))}if(0==c.mal){this.logAndScroll(LOG.WARNING,"No MyAnimeList id, skip.");continue}let f={};if(f.myAnimeListId=c.mal,f.currentChapter={chapter:c.last,volume:0},await this.fetchMyAnimeList(f,c.mal),!this.loggedMyAnimeList)return this.logAndScroll(LOG.ERROR,"Not logged on MyAnimeList, aborting."),void(await updateLocalStorage({mangaDexId:this.mangaDexMangaList[d],lastMangaDexChapter:0,myAnimeListId:0,chapters:[]},this.options));if(f.is_approved?f.in_list?c.last>f.lastMyAnimeListChapter?(await this.updateMyAnimeList(f,b),this.logAndScroll(LOG.INFO,"> MyAnimeList #"+c.mal+" updated with chapter "+c.last),f.lastMangaDexChapter=c.last):(this.logAndScroll(LOG.INFO,"> MyAnimeList #"+c.mal+" NOT updated since it is up to date."),f.currentChapter.chapter=f.lastMyAnimeListChapter,f.lastMangaDexChapter=f.lastMyAnimeListChapter):(await this.updateMyAnimeList(f,b),this.logAndScroll(LOG.INFO,"> MyAnimeList #"+c.mal+" added with chapter "+c.last)):this.logAndScroll(LOG.INFO,"The manga is still pending approval on MyAnimelist and can't be updated, skip."),e){if(f.mangaDexId=this.mangaDexMangaList[d],f.chapters=[],this.options.saveAllOpened){let b=a(f.currentChapter.chapter-this.options.maxChapterSaved,0);for(let a=f.currentChapter.chapter;a>b;a--)f.chapters.push(a)}await updateLocalStorage(f,this.options)}}this.logAndScroll(LOG.SUCCESS,"Status "+b+" done.")}}this.flashBackground(!0),this.logAndScroll(LOG.SUCCESS,"Done."),this.malBusy=!1}}async fetchMyAnimeList(a){let b=await fetch("https://myanimelist.net/ownlist/manga/"+a.myAnimeListId+"/edit?hideLayout",{method:"GET",redirect:"follow",cache:"no-cache",credentials:"include"}),c=await b.text();-1<b.url.indexOf("login.php")?this.loggedMyAnimeList=!1:(this.csrf=/'csrf_token'\scontent='(.{40})'/.exec(c)[1],processMyAnimeListResponse(a,c))}async updateMyAnimeList(a,b){4==b?b=6:5==b?b=4:6==b&&(b=1,a.is_rereading=!0);let{requestURL:c,body:d}=buildMyAnimeListBody(!0,a,this.csrf,b);try{await fetch(c,{method:"POST",body:d,redirect:"follow",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded",accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"}})}catch(a){this.logAndScroll(LOG.ERROR,"Error updating the manga. error: "+a)}}toggleOnlinePanels(a=!0){a?(this.onlineOptions.style.display="block",this.options.isLoggedIn?(this.loggedInPanel.style.display="block",this.loggedOutPanel.style.display="none",this.onlineAdvancedPanel.style.display="block"):(this.loggedInPanel.style.display="none",this.loggedOutPanel.style.display="block",this.onlineAdvancedPanel.style.display="none")):this.onlineOptions.style.display="none"}hideOnlineMessage(a=void 0){("error"==a||a==null)&&(this.onlineError.style.display="none"),("success"==a||a==null)&&(this.onlineSuccess.style.display="none")}handleOnlineError(a){if("string"==typeof a&&(a={status:a}),this.onlineError.style.display="block",this.onlineError.textContent="",this.flashBackground(!1),null==a.status)Object.keys(a).forEach(b=>{let c=document.createElement("b");c.textContent=b+": ",this.onlineError.appendChild(c),this.onlineError.appendChild(document.createTextNode(a[b].join(", "))),this.onlineError.appendChild(document.createElement("br"))});else{let b=document.createElement("b");b.textContent="Error: ",this.onlineError.appendChild(b),this.onlineError.appendChild(document.createTextNode(a.status))}}handleOnlineSuccess(a){"string"==typeof a&&(a={status:a}),this.onlineSuccess.style.display="block",this.onlineSuccess.textContent="";let b=document.createElement("b");b.textContent="Success: ",this.onlineSuccess.appendChild(b),this.onlineSuccess.appendChild(document.createTextNode(a.status))}getPassword(){let a=this.onlineForm.password.value;return this.onlineForm.password.value="",""==a||10>a.length?(this.handleOnlineError("Empty or invalid password."),!1):a}async login(){this.hideOnlineMessage();let a=this.onlineForm.onlineURL.value,b=this.onlineForm.username.value,c=this.getPassword();if(c)try{let d=await fetch(a+"user",{method:"GET",headers:{Accept:"application/json","X-Auth-Name":b,"X-Auth-Pass":c}}),e=await d.json();200==d.status?(this.options.onlineURL=a,this.options.username=b,this.options.isLoggedIn=!0,this.options.token=e.token,this.handleOnlineSuccess(e),this.saveOptions(),this.toggleOnlinePanels()):this.handleOnlineError(e)}catch(a){this.handleOnlineError(a)}}async register(){this.hideOnlineMessage();let a=this.onlineForm.onlineURL.value,b={username:this.onlineForm.username.value};if(b.password=this.getPassword(),!!b.password)try{let c=await fetch(a+"user",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json; charset=utf-8"},body:JSON.stringify(b)}),d=await c.json();201==c.status?(this.options.onlineURL=a,this.options.username=b.username,this.options.isLoggedIn=!0,this.options.token=d.token,this.handleOnlineSuccess(d),this.saveOptions(),this.toggleOnlinePanels()):this.handleOnlineError(d)}catch(a){this.handleOnlineError(a)}}logout(){this.hideOnlineMessage(),this.options.username="",this.options.isLoggedIn=!1,this.options.token="",this.onlineForm.username.value="",this.onlineForm.password.value="",this.handleOnlineSuccess("Logged out."),this.saveOptions(),this.toggleOnlinePanels()}async importOnline(){this.hideOnlineMessage();try{let a=await fetch(this.options.onlineURL+"user/self/title",{method:"GET",headers:{Accept:"application/json","X-Auth-Token":this.options.token}}),b=await a.json();if(200==a.status){browser.storage.local.clear();let a={};b.titles.forEach(b=>{a[b.md_id]={mal:b.mal_id,last:b.last,chapters:b.chapters}}),storageSet(null,a),this.saveOptions(),this.handleOnlineSuccess("Titles imported.")}else this.handleOnlineError(b)}catch(a){this.handleOnlineError(a)}}async exportOnline(){this.hideOnlineMessage();let a={titles:{},options:{saveAllOpened:this.options.saveAllOpened,maxChapterSaved:this.options.maxChapterSaved}},b=await storageGet(null);Object.keys(b).forEach(c=>{"options"==c||(a.titles[c]=b[c])});try{let b=await fetch(this.options.onlineURL+"user/self/title",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json; charset=utf-8","X-Auth-Token":this.options.token},body:JSON.stringify(a)}),c=await b.json();200==b.status?this.handleOnlineSuccess(c):this.handleOnlineError(c)}catch(a){this.handleOnlineError(a)}}async deleteOnline(){this.hideOnlineMessage();let a=document.getElementById("deleteOnline");if(void 0===a.dataset.again)return a.style.fontSize="2rem",a.dataset.again=!0,void(a.textContent="Click again to confirm");a.style.fontSize="1rem",delete a.dataset.again,a.textContent="Delete Online";let b=this.getPassword();if(b)try{let a=await fetch(this.options.onlineURL+"user/self",{method:"DELETE",headers:{Accept:"application/json","X-Auth-Name":this.options.username,"X-Auth-Pass":b}}),c=await a.json();200==a.status?(this.options.username="",this.options.isLoggedIn=!1,this.options.token="",this.onlineForm.username.value="",this.handleOnlineSuccess(c),this.saveOptions(),this.toggleOnlinePanels()):this.handleOnlineError(c)}catch(a){this.handleOnlineError(a)}}async update(){this.hideOnlineMessage();let a=this.getPassword();if(a){let b=this.onlineForm.password.dataset.currentPassword;if(void 0===b)return this.onlineForm.password.dataset.currentPassword=a,void this.handleOnlineSuccess("Enter your new password and click Update Credentials again.");delete this.onlineForm.password.dataset.currentPassword;try{let c=await fetch(this.options.onlineURL+"user/self",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json; charset=utf-8","X-Auth-Name":this.options.username,"X-Auth-Pass":b},body:JSON.stringify({password:a})}),d=await c.json();200==c.status?(this.options.token=d.token,this.handleOnlineSuccess(d),this.saveOptions()):this.handleOnlineError(d)}catch(a){this.handleOnlineError(a)}}}async refreshToken(){this.hideOnlineMessage();let a=this.getPassword();if(a)try{let b=await fetch(this.options.onlineURL+"user/self/token/refresh",{method:"GET",headers:{Accept:"application/json","X-Auth-Name":this.options.username,"X-Auth-Pass":a}}),c=await b.json();200==b.status?(this.options.token=c.token,this.handleOnlineSuccess("Token updated."),this.saveOptions()):this.handleOnlineError(c)}catch(a){this.handleOnlineError(a)}}async receiveToken(){this.hideOnlineMessage();let a=this.getPassword();if(a)try{let b=await fetch(this.options.onlineURL+"user/self/token",{method:"GET",headers:{Accept:"application/json","X-Auth-Name":this.options.username,"X-Auth-Pass":a}}),c=await b.json();200==b.status?(this.options.token=c.token,this.handleOnlineSuccess("Token received."),this.saveOptions()):this.handleOnlineError(c)}catch(a){this.handleOnlineError(a)}}async downloadOnline(){try{let a=await fetch(this.options.onlineURL+"user/self/title",{method:"GET",headers:{Accept:"application/json","X-Auth-Token":this.options.token}}),b=await a.json(),c={options:JSON.parse(JSON.stringify(this.options))};b.titles.forEach(a=>{c[a.md_id]={mal:a.mal_id,last:a.last,chapters:a.chapters}}),200==a.status?(this.downloadOnlineButton.href="data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(c)),this.downloadOnlineButton.click(),this.downloadOnlineButton.href=""):this.handleOnlineError(b)}catch(a){this.handleOnlineError(a)}}}document.addEventListener("DOMContentLoaded",()=>{new OptionsManager});