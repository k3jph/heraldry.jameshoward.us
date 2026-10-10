// Give Markdown tables their own keyboard-accessible scroll area. The article
// itself stays at viewport width, including its headings and editorial notes.
export default function scrollableTables(){
  return tree=>{
    const visit=node=>{
      if(!node.children)return;
      node.children=node.children.map(child=>{
        if(child.type==='element'&&child.tagName==='table')return {
          type:'element',tagName:'div',properties:{className:['table-wrapper'],role:'region',ariaLabel:'Table: scroll horizontally to see all columns',tabIndex:0},children:[child],
        };
        visit(child);return child;
      });
    };
    visit(tree);
  };
}
