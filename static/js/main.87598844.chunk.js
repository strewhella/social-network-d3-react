(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(t,e,n){t.exports=n(24)},20:function(t,e,n){},24:function(t,e,n){"use strict";n.r(e);var r=n(1),o=n.n(r),a=n(12),i=n.n(a),c=(n(20),n(9)),s=n.n(c),u=n(14),l=n(13),d=n(4),f=n(5),h=n(7),p=n(6),g=n(3),v=n(8),m=n(2),y=function(t){return r.createElement(r.Fragment,null,r.createElement("h1",{className:"title"},"The Social Network"),r.createElement("a",{className:"button add",onClick:t.onAdd},r.createElement("div",null,"+")),r.createElement("a",{className:"button clear",onClick:t.onClear},r.createElement("div",null,"-")))},w=n(0),b=w.k("exit").ease(w.a).duration(400),j=w.k("enter").ease(w.b).duration(400),O=w.k("change").ease(w.c).duration(600),x=function(t,e){var n=Object(m.random)(0,255),r=Object(m.random)(0,255),o=Object(m.random)(0,255),a="rgb(".concat(n,",").concat(r,",").concat(o,")");return e[t]={id:t,tags:new Set,radius:0,following:new Set,followed:new Set,color:a},e[t]},k=function(t,e,n){return Math.max(e,Math.min(n-e,t))},E=function(t){return":"===t[t.length-1]&&(t=t.substring(0,t.length-1)),t},C=Math.PI/2,A=function(t){function e(){var t,n;Object(d.a)(this,e);for(var r=arguments.length,o=new Array(r),a=0;a<r;a++)o[a]=arguments[a];return(n=Object(h.a)(this,(t=Object(p.a)(e)).call.apply(t,[this].concat(o)))).circleGroup=void 0,n.triangleGroup=void 0,n}return Object(v.a)(e,t),Object(f.a)(e,[{key:"render",value:function(){var t=this,e=this.props,n=e.width,o=e.height,a=e.center,i=e.people,c=e.follows,s=e.onHover;i.forEach(function(t){t.x=t.x||Object(m.random)(a.x-50,a.x+50),t.y=t.y||Object(m.random)(a.y-50,a.y+50)});var u=w.h(i).force("links",w.f(c).id(function(t){return t.id}).distance(function(t){return t.source.radius+t.target.radius+10}).strength(0)).force("center",w.d(a.x,a.y)).force("charge",w.g().strength(-1)).force("collide",w.e().radius(function(t){return t.radius})),l=w.i(this.circleGroup).selectAll("circle").data(i,function(t){return t.id+""});l.exit().on("mouseover",null).on("mouseout",null).transition(b).style("transform","scale(0)").remove();var d=l.enter().append("circle");d.style("transform","scale(0)").attr("fill","#000000").attr("stroke",function(t){return t.color}).attr("stroke-width",function(t){return t.radius/4}).attr("data-id",function(t){return"id-".concat(t.id)}).transition(j).style("transform-origin","center").style("cursor","pointer").style("transform","scale(1)"),l=d.merge(l).on("mouseover",function(t){w.j("circle").each(function(e){w.i(this).attr("opacity",t.id===e.id||t.following.has(e.id)?1:.1)}),w.j("polygon").each(function(e){w.i(this).attr("opacity",t.id===e.source.id?1:.05)}),w.j("[data-id=id-".concat(t.id,"]")).attr("fill",t.color),s(t.id)}).on("mouseout",function(t){w.j("circle[data-id=id-".concat(t.id,"]")).attr("fill","#000000"),w.j("polygon[data-id=id-".concat(t.id,"]")).attr("fill","#808080"),w.j("circle").attr("opacity",1),w.j("polygon").attr("opacity",1),s()}).attr("r",function(t){return t.radius}).attr("cx",a.x).attr("cy",a.y).attr("fill",function(t){return t.hovering?t.color:"#000000"});var f=w.i(this.triangleGroup).selectAll("polygon").data(c);f.exit().transition(b).style("transform-origin","center").style("transform","scale(0)").remove();var h=f.enter().append("polygon").style("cursor","pointer").attr("data-id",function(t){return"id-".concat(t.source.id)});return f=h.merge(f).attr("fill",function(t){return t.hovering?t.color:"#808080"}),u.nodes(i).on("tick",function(){l.attr("cx",function(t){return k(t.x,t.radius,n)}).attr("cy",function(t){return k(t.y,t.radius,o)}),f.attr("points",function(t){var e=k(t.source.x,t.source.radius,n),r=k(t.source.y,t.source.radius,o),a=k(t.target.x,t.target.radius,n),i=k(t.target.y,t.target.radius,o),c=Math.atan2(i-r,a-e),s=Math.cos(c)*-t.target.radius+a,u=Math.sin(c)*-t.target.radius+i,l=t.source.radius/6,d=Math.cos(c+C)*l+e,f=Math.cos(c-C)*l+e,h=Math.sin(c+C)*l+r,p=Math.sin(c-C)*l+r;return"".concat(d,",").concat(h," ").concat(f,",").concat(p," ").concat(s,",").concat(u)})}),r.createElement("svg",{width:n,height:o},r.createElement("g",{ref:function(e){return t.triangleGroup=e}}),r.createElement("g",{ref:function(e){return t.circleGroup=e}}))}}]),e}(r.PureComponent),M=window.innerWidth/20,P=function(t){function e(){var t,n;Object(d.a)(this,e);for(var r=arguments.length,o=new Array(r),a=0;a<r;a++)o[a]=arguments[a];return(n=Object(h.a)(this,(t=Object(p.a)(e)).call.apply(t,[this].concat(o)))).svg=void 0,n}return Object(v.a)(e,t),Object(f.a)(e,[{key:"render",value:function(){var t=this,e=this.props,n=e.width,o=e.height,a=e.center,i=e.people,c=e.hoverPerson,s=function(t){var e={};return t.forEach(function(t){t.tags.forEach(function(t){var n=Object.keys(e).find(function(e){return e.toLowerCase()===t.toLowerCase()});n&&(t=n),e[t]||(e[t]=0),e[t]++})}),Object.keys(e).map(function(t){return{tag:t,count:e[t]}})}(i),u=w.i(this.svg).selectAll("text").data(s,function(t){return t.tag}),l=u.enter().append("text").style("transform-origin","center").attr("x",function(t){return Object(m.random)(M,n-M)}).attr("y",function(t){return Object(m.random)(M,o-M)});l.transition(j).style("transform","scale(1)"),u.exit().transition(b).style("transform","scale(0)").remove();var d=w.k("words").duration(1e3),f=l.merge(u).text(function(t){return t.tag});f.interrupt("change"),f.transition(O).attr("fill",function(t){var e=c&&c.tags.has(t.tag)?c.color:Object(m.random)(150,220);return"rgb(".concat(e,",").concat(e,",").concat(e,")")}).attr("opacity",function(t){return c&&!c.tags.has(t.tag)?.1:1});var h=w.h(s).force("center",w.d().x(a.x).y(a.y)).force("charge",w.g()).force("collide",w.e());return h.tick(3),h.stop(),f.interrupt(),f.transition(d).attr("x",function(t){return t.x}).attr("y",function(t){return t.y}).attr("font-size",function(t){return 3*t.count+6+"px"}),r.createElement("svg",{ref:function(e){return t.svg=e},width:n,height:o})}}]),e}(r.PureComponent),z=function(t){function e(t){var n;Object(d.a)(this,e),n=Object(h.a)(this,Object(p.a)(e).call(this,t));var r=window.innerWidth,o=window.innerHeight,a={x:r/2,y:o/2};return n.state={people:{},follows:[],width:r,height:o,center:a},n.onAdd=n.onAdd.bind(Object(g.a)(n)),n.onClear=n.onClear.bind(Object(g.a)(n)),n.onResize=n.onResize.bind(Object(g.a)(n)),n.onHoverPerson=n.onHoverPerson.bind(Object(g.a)(n)),n}return Object(v.a)(e,t),Object(f.a)(e,[{key:"componentDidMount",value:function(){this.onAdd(),window.addEventListener("resize",this.onResize)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.onResize)}},{key:"render",value:function(){var t=this.state,e=t.width,n=t.height,r=t.follows,a=t.center,i=t.hoveringPerson,c=t.people;return o.a.createElement(o.a.Fragment,null,o.a.createElement(P,{width:e,height:n,center:a,people:c.list||[],hoverPerson:i}),o.a.createElement(A,{people:c.list||[],follows:r,width:e,height:n,center:a,onHover:this.onHoverPerson}),o.a.createElement(y,{onAdd:this.onAdd,onClear:this.onClear}))}},{key:"onResize",value:function(){var t=window.innerWidth,e=window.innerHeight,n={x:t/2,y:e/2};this.setState({width:t,height:e,center:n})}},{key:"onAdd",value:function(){var t=Object(l.a)(s.a.mark(function t(){var e,n,r,o,a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,store.sample();case 3:return e=t.sent,n=Object(u.a)({},this.state.people),r=Object(m.uniq)(e.reduce(function(t,e){return t.concat(e)},[])),o=r.filter(function(t){return!n[t]}),t.next=9,store.tags(o);case 9:a=t.sent,o.forEach(function(t,e){var r=x(t,n);r.tags=new Set(a[e].map(E)),r.radius=.3*r.tags.size+4}),n.list=Object.keys(n).filter(function(t){return"list"!==t}).map(function(t){return n[t]}),e.forEach(function(t){var e=n[t[0]],r=n[t[1]];e.following.add(r.id),r.followed.add(e.id)}),this.setState({people:n,follows:this.state.follows.concat(e.map(function(t){return{source:t[0],target:t[1]}}))}),t.next=19;break;case 16:t.prev=16,t.t0=t.catch(0),console.error(t.t0);case 19:case"end":return t.stop()}},t,this,[[0,16]])}));return function(){return t.apply(this,arguments)}}()},{key:"onHoverPerson",value:function(t){var e=this.state.people;this.setState({hoveringPerson:e[t]})}},{key:"onClear",value:function(){this.setState({people:{},follows:[]})}}]),e}(r.Component);i.a.render(o.a.createElement(z,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.87598844.chunk.js.map