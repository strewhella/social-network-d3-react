(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(t,e,n){t.exports=n(24)},20:function(t,e,n){},24:function(t,e,n){"use strict";n.r(e);var r=n(1),o=n.n(r),i=n(12),a=n.n(i),c=(n(20),n(9)),s=n.n(c),u=n(14),l=n(13),d=n(4),h=n(5),f=n(7),g=n(6),p=n(3),v=n(8),m=n(2),y=function(t){function e(t){var n;return Object(d.a)(this,e),(n=Object(f.a)(this,Object(g.a)(e).call(this,t))).adding=void 0,n.onAdd=n.onAdd.bind(Object(p.a)(n)),n}return Object(v.a)(e,t),Object(h.a)(e,[{key:"render",value:function(){var t=this.props,e=(t.onAdd,t.onClear);return r.createElement(r.Fragment,null,r.createElement("h1",{className:"title"},"The Social Network"),r.createElement("a",{className:"button add",onClick:this.onAdd},r.createElement("div",null,"+")),r.createElement("a",{className:"button clear",onClick:e},r.createElement("div",null,"-")))}},{key:"onAdd",value:function(){var t=this;this.adding||(this.adding=!0,this.props.onAdd(),setTimeout(function(){t.adding=!1},1e3))}}]),e}(r.PureComponent),b=n(0),w=b.k("exit").ease(b.a).duration(400),j=b.k("enter").ease(b.b).duration(400),O=b.k("change").ease(b.c).duration(600),x=function(t){var e={};return t.forEach(function(t){t.tags.forEach(function(t){var n=Object.keys(e).find(function(e){return e.toLowerCase()===t.toLowerCase()});n&&(t=n),e[t]||(e[t]=0),e[t]++})}),Object.keys(e).map(function(t){var n=Object(m.random)(150,220);return{tag:t,count:e[t],color:"rgb(".concat(n,",").concat(n,",").concat(n,")")}})},k=function(t,e){var n={};return Object(m.cloneDeep)(t).concat(Object(m.cloneDeep)(e)).forEach(function(t){var e=t.tag.toLowerCase();n[e]?n[e].count+=t.count:n[e]=t}),Object.keys(n).map(function(t){return n[t]})},E=function(t,e){var n=Object(m.random)(0,255),r=Object(m.random)(0,255),o=Object(m.random)(0,255),i="rgb(".concat(n,",").concat(r,",").concat(o,")");return e[t]={id:t,tags:new Set,radius:0,following:new Set,followed:new Set,color:i},e[t]},P=function(t,e,n){return Math.max(e,Math.min(n-e,t))},A=function(t){return":"===t[t.length-1]&&(t=t.substring(0,t.length-1)),t},C=Math.PI/2,S=function(t){function e(t){var n;Object(d.a)(this,e),(n=Object(f.a)(this,Object(g.a)(e).call(this,t))).circleGroup=void 0,n.triangleGroup=void 0,n.simulation=void 0;var r=t.people,o=t.follows,i=t.center;return n.simulation=b.h(r).force("links",b.f(o).id(function(t){return t.id}).distance(function(t){return t.source.radius+t.target.radius+10}).strength(0)).force("center",b.d(i.x,i.y)).force("charge",b.g().strength(-1)).force("collide",b.e().radius(function(t){return t.radius})),n}return Object(v.a)(e,t),Object(h.a)(e,[{key:"render",value:function(){var t=this,e=this.props,n=e.width,o=e.height,i=e.center,a=e.people,c=e.follows,s=e.onHover;a.forEach(function(t){t.x=t.x||Object(m.random)(i.x-50,i.x+50),t.y=t.y||Object(m.random)(i.y-50,i.y+50)}),this.simulation.nodes(a),this.simulation.force("links").links(c),this.simulation.alpha(1).restart();var u=b.i(this.circleGroup).selectAll("circle").data(a,function(t){return t.id+""});u.exit().on("mouseover",null).on("mouseout",null).transition(w).style("transform","scale(0)").remove();var l=u.enter().append("circle");l.style("transform","scale(0)").attr("fill","#000000").attr("stroke",function(t){return t.color}).attr("stroke-width",function(t){return t.radius/4}).attr("data-id",function(t){return"id-".concat(t.id)}).transition(j).style("transform-origin","center").style("cursor","pointer").style("transform","scale(1)"),u=l.merge(u).on("mouseover",function(t){b.j("circle").each(function(e){b.i(this).attr("opacity",t.id===e.id||t.following.has(e.id)?1:.1)}),b.j("polygon").each(function(e){b.i(this).attr("opacity",t.id===e.source.id?1:.05)}),b.j("[data-id=id-".concat(t.id,"]")).attr("fill",t.color),s(t.id)}).on("mouseout",function(t){b.j("circle[data-id=id-".concat(t.id,"]")).attr("fill","#000000"),b.j("polygon[data-id=id-".concat(t.id,"]")).attr("fill","#808080"),b.j("circle").attr("opacity",1),b.j("polygon").attr("opacity",1),s()}).attr("r",function(t){return t.radius}).attr("cx",i.x).attr("cy",i.y).attr("fill",function(t){return t.hovering?t.color:"#000000"});var d=b.i(this.triangleGroup).selectAll("polygon").data(c);d.exit().transition(w).style("transform-origin","center").style("transform","scale(0)").remove();var h=d.enter().append("polygon").style("cursor","pointer").attr("data-id",function(t){return"id-".concat(t.source.id)});return d=h.merge(d).attr("fill",function(t){return t.hovering?t.color:"#808080"}),this.simulation.nodes(a).on("tick",function(){u.attr("cx",function(t){return P(t.x,t.radius,n)}).attr("cy",function(t){return P(t.y,t.radius,o)}),d.attr("points",function(t){var e=P(t.source.x,t.source.radius,n),r=P(t.source.y,t.source.radius,o),i=P(t.target.x,t.target.radius,n),a=P(t.target.y,t.target.radius,o),c=Math.atan2(a-r,i-e),s=Math.cos(c)*-t.target.radius+i,u=Math.sin(c)*-t.target.radius+a,l=t.source.radius/6,d=Math.cos(c+C)*l+e,h=Math.cos(c-C)*l+e,f=Math.sin(c+C)*l+r,g=Math.sin(c-C)*l+r;return"".concat(d,",").concat(f," ").concat(h,",").concat(g," ").concat(s,",").concat(u)})}),r.createElement("svg",{width:n,height:o},r.createElement("g",{ref:function(e){return t.triangleGroup=e}}),r.createElement("g",{ref:function(e){return t.circleGroup=e}}))}}]),e}(r.PureComponent),H=window.innerWidth/20,F=function(t){function e(t){var n;return Object(d.a)(this,e),(n=Object(f.a)(this,Object(g.a)(e).call(this,t))).svg=void 0,n.simulation=void 0,n.state={},n.simulation=n.createSimulation(),n}return Object(v.a)(e,t),Object(h.a)(e,[{key:"componentWillReceiveProps",value:function(t){this.props.hoverPerson&&!t.hoverPerson&&this.setState({finishingHover:!0}),!this.state.finishingHover||this.props.hoverPerson||t.hoverPerson||this.setState({finishingHover:!1}),0===this.props.tagFrequencies.length&&t.tagFrequencies.length>0&&(this.simulation=this.createSimulation())}},{key:"render",value:function(){var t=this,e=this.props,n=e.width,o=e.height,i=e.tagFrequencies,a=e.hoverPerson,c=e.center,s=this.state.finishingHover,u=b.i(this.svg).selectAll("text").data(i,function(t){return t.tag}),l=u.enter().append("text").style("transform-origin","center").attr("x",function(t){return Object(m.random)(H,n-H)}).attr("y",function(t){return Object(m.random)(H,o-H)});l.transition(j).style("transform","scale(1)");var d=u.exit();d.interrupt("exit"),d.transition(w).style("transform","scale(0)").remove();var h=b.k("words").duration(1e3),f=l.merge(u).text(function(t){return t.tag});return f.interrupt("change"),f.transition(O).attr("fill",function(t){return a&&a.tags.has(t.tag)?a.color:t.color}).attr("opacity",function(t){return a&&!a.tags.has(t.tag)?.1:1}),a||s||(i.forEach(function(t){t.x=Object(m.random)(c.x-H,c.x+H),t.y=Object(m.random)(c.y-H,c.y+H)}),this.simulation.nodes(i),this.simulation.tick(3),this.simulation.stop()),f.transition(h).attr("x",function(t){return t.x}).attr("y",function(t){return t.y}).attr("font-size",function(t){return 3*t.count+6+"px"}),r.createElement("svg",{ref:function(e){return t.svg=e},width:n,height:o})}},{key:"createSimulation",value:function(){var t=this.props,e=t.tagFrequencies,n=t.center;return b.h(e).force("center",b.d().x(n.x).y(n.y)).force("charge",b.g().strength(-window.innerHeight/4)).force("collide",b.e().strength(50))}}]),e}(r.PureComponent),q=function(t){function e(t){var n;Object(d.a)(this,e),n=Object(f.a)(this,Object(g.a)(e).call(this,t));var r=window.innerWidth,o=window.innerHeight,i={x:r/2,y:o/2};return n.state={people:{},follows:[],width:r,height:o,center:i,tagFrequencies:[]},n.onAdd=n.onAdd.bind(Object(p.a)(n)),n.onClear=n.onClear.bind(Object(p.a)(n)),n.onResize=n.onResize.bind(Object(p.a)(n)),n.onHoverPerson=n.onHoverPerson.bind(Object(p.a)(n)),n}return Object(v.a)(e,t),Object(h.a)(e,[{key:"componentDidMount",value:function(){this.onAdd(),window.addEventListener("resize",this.onResize)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.onResize)}},{key:"render",value:function(){var t=this.state,e=t.width,n=t.height,r=t.follows,i=t.center,a=t.hoveringPerson,c=t.people,s=t.tagFrequencies;return o.a.createElement(o.a.Fragment,null,o.a.createElement(F,{width:e,height:n,center:i,hoverPerson:a,tagFrequencies:s}),o.a.createElement(S,{people:c.list||[],follows:r,width:e,height:n,center:i,onHover:this.onHoverPerson}),o.a.createElement(y,{onAdd:this.onAdd,onClear:this.onClear}))}},{key:"onResize",value:function(){var t=window.innerWidth,e=window.innerHeight,n={x:t/2,y:e/2};this.setState({width:t,height:e,center:n})}},{key:"onAdd",value:function(){var t=Object(l.a)(s.a.mark(function t(){var e,n,r,o,i,a,c,l;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,store.sample();case 3:return e=t.sent,n=Object(u.a)({},this.state.people),r=Object(m.uniq)(e.reduce(function(t,e){return t.concat(e)},[])),o=r.filter(function(t){return!n[t]}),t.next=9,store.tags(o);case 9:i=t.sent,a=o.map(function(t,e){var r=E(t,n);return r.tags=new Set(i[e].map(A)),r.radius=.3*r.tags.size+4,r}),n.list=Object.keys(n).filter(function(t){return"list"!==t}).map(function(t){return n[t]}),e.forEach(function(t){var e=n[t[0]],r=n[t[1]];e.following.add(r.id),r.followed.add(e.id)}),c=x(a),l=k(this.state.tagFrequencies,c),this.setState({people:n,tagFrequencies:l,follows:this.state.follows.concat(e.map(function(t){return{source:t[0],target:t[1]}}))}),t.next=21;break;case 18:t.prev=18,t.t0=t.catch(0),console.error(t.t0);case 21:case"end":return t.stop()}},t,this,[[0,18]])}));return function(){return t.apply(this,arguments)}}()},{key:"onHoverPerson",value:function(t){var e=this.state.people;this.setState({hoveringPerson:e[t]})}},{key:"onClear",value:function(){this.setState({people:{},follows:[],tagFrequencies:[]})}}]),e}(r.Component);a.a.render(o.a.createElement(q,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.8d0c1130.chunk.js.map