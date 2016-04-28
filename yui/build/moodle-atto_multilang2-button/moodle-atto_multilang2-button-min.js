YUI.add("moodle-atto_multilang2-button",function(e,t){var n={TAG:"filter-multilang-tag"},r="%lang",i="%content",s="languages",o="capability",u="highlight",a="css",f='{"en":"English (en)"}',l=!0,c=!0,h="outline: 1px dotted;padding: 0.1em;margin: 0em 0.1em;background-color: #ffffaa;",p={SPANED:'&nbsp;<span class="'+n.TAG+'">{mlang '+r+"}</span>"+i+'<span class="'+n.TAG+'">{mlang}</span>&nbsp;',NOT_SPANED:"{mlang "+r+"}"+i+"{mlang}"},d='<span class="'+n.TAG+'">';e.namespace("M.atto_multilang2").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{_highlight:!0,initializer:function(){var e=this.get(o),t=[];e&&(t=this._initializeToolbarItems(),this._highlight=this.get(u),this.addToolbarMenu({globalItemConfig:{callback:this._addTags},icon:"icon",iconComponent:"atto_multilang2",items:t}),this.get("host").on("atto:selectionchanged",this._checkSelectionChange,this),this._addDelimiterCss(),this._highlight&&(this._decorateTagsOnInit(),this._setSubmitListeners()))},_addDelimiterCss:function(){var e="."+n.TAG+"{"+this.get(a)+"}",t;t=document.createElement("style"),t.type="text/css",t.innerHTML=e,document.head.appendChild(t)},_initializeToolbarItems:function(){var e=[],t,n;t=JSON.parse(this.get(s));for(n in t)t.hasOwnProperty(n)&&e.push({text:t[n],callbackArgs:n});return e},_addTags:function(e,t){var n,s=this.get("host"),o,u;o=this._highlight?p.SPANED:p.NOT_SPANED,n=this._getSelectionHTML(),u=s.getSelection().toString().length===0?"&nbsp;":n,o=o.replace(r,t),o=o.replace(i,u),s.insertContentAtFocusPoint(o),this.markUpdated()},_getSelectionHTML:function(){var e="",t,n,r,i;if(typeof window.getSelection!="undefined"){t=window.getSelection();if(t.rangeCount){n=document.createElement("div");for(r=0,i=t.rangeCount;r<i;++r)n.appendChild(t.getRangeAt(r).cloneContents());e=n.innerHTML}}else typeof document.selection!="undefined"&&document.selection.type==="Text"&&(e=document.selection.createRange().htmlText);return e},_checkSelectionChange:function(){var t=this.get("host"),n=t.getSelectionParentNode(),r=e.one(n).get("text"),i,s;i=e.one(n).toString().indexOf("#text")>-1,s=r.match(/\{mlang/g).length===1,i&&s&&t.setSelection(t.getSelectionFromNode(e.one(n)))},_setSubmitListeners:function(){var t=e.one("#id_submitbutton"),n=e.one("#id_submitbutton2");t.on("click",this._cleanTagsOnSubmit,this),n!==null&&n.on("click",this._cleanTagsOnSubmitSecondButton,this)},_cleanTagsOnSubmit:function(t){var n;t.preventDefault(),n=e.one("#id_submitbutton"),this._cleanTagsWithNoYuiId(),this._cleanTagsWithYuiId(),n.detach("click",this._cleanTagsOnSubmit),n.simulate("click")},_cleanTagsOnSubmitSecondButton:function(t){var n;t.preventDefault(),n=e.one("#id_submitbutton2"),this._cleanTagsWithNoYuiId(),this._cleanTagsWithYuiId(),n.detach("click",this._cleanTagsOnSubmitSecondButton),n.simulate("click")},_cleanTagsWithNoYuiId:function(){var t=e.all(".editor_atto_content"),n,r,i,s,o,u,a,f;f=new RegExp(d+".*?"+"</span>","g"),!t instanceof Array&&(n=t,t=[],t[0]=n);for(r=0;r<t._nodes.length;r++){n=t._nodes[r].id,n=e.one(document.getElementById(n)),i=n.get("innerHTML"),s=i.match(f);if(s===null)continue;for(u=0;u<s.length;u++)o=s[u],a=o.replace(d,""),a=a.replace("</span>",""),i=i.replace(o,a);n.set("innerHTML",i)}this.markUpdated()},_cleanTagsWithYuiId:function(){var t=e.all(".editor_atto_content"),n,r,i,s,o,u,a,f,l,c;f=d.replace("<span",'<span id="yui_.*?"'),a=new RegExp(f+".*?{mlang.*?}</span>","g"),!t instanceof Array&&(n=t,t=[],t[0]=n);for(r=0;r<t._nodes.length;r++){n=t._nodes[r].id,n=e.one(document.getElementById(n)),i=n.get("innerHTML"),l=i.match(a);if(l===null)continue;for(o=0;o<l.length;o++)s=l[o],c=s.match(/\{mlang.*?\}/g)[0],u=s.replace(a,c),u=u.replace("</span>",""),i=i.replace(s,u);n.set("innerHTML",i),this.markUpdated()}},_decorateTagsOnInit:function(){var t=e.all(".editor_atto_content"),n,r,i,s,o,u,a=[],f;n=this._getHTMLwithCleanedTags(),r=new RegExp("{mlang.*?}","g"),i=n.match(r);if(i!==null){for(o=0;o<i.length;o++)s=i[o],f=a.indexOf(s)===-1,f&&(a.push(s),u=d+s+"</span>",r=new RegExp(s,"g"),n=n.replace(r,u));t.set("innerHTML",n)}},_getHTMLwithCleanedTags:function(){var e=this.get("host"),t=e.getCleanHTML(),n,r,i,s,o,u;n=d+".*?"+"</span>",r=new RegExp(n,"g"),i=t.match(r);if(i!==null)for(u=0;u<i.length;u++)s=i[u],o=s.replace(d,""),o=o.replace("</span>",""),t=t.replace(s,o);return t}},{ATTRS:{languages:f,capability:l,highlight:c,css:h}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});
