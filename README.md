# MWR_TreeView
A VERY FAST, lightweight, infinitely deep, jQueryUI widget, AJAX TreeView control.

You really only need the files <a href="https://github.com/tsamop/MWR_TreeView/blob/master/JSON_TreeView/scripts/MWR_Treeview.js">MWR_Treeview.js</a> and <a href="https://github.com/tsamop/MWR_TreeView/blob/master/JSON_TreeView/styles/MWR_Treeview.css">MWR_Treeview.css</a>, the rest of the project is just included as an example to help people understand the AJAX/JSON callbacks.

<h1> I wrote this because: </h1>
<ul>
    <li>I wanted the TreeView to be supported by a single .js and .css file</li>

<li>I wanted the TreeView to instantiate like any other jQueryUI widget.</li>

<li>I needed a Treeview that would use three AJAX requests to create itself:</li>
<ul>
    <li>1). Give me a single node by ID.</li>
    <li>2). Give me the path of a node in a tree (path between node and root) by ID.</li>
    <li>3). Give me all the child nodes of a node by ID.</li>
</ul>

<li>I wanted all the formatting of the nodes done server-side, and fully customizable.</li>

<li>I did not want any recursive queries on the server</li>

<li>I wanted the widget to start up in several different ways:</li>
<ul>
    <li>1). Start from a node ID deep in the tree, and have the treeview render based on that node, with either</li>
<ul>
      <li>a). All root nodes displayed</li>
      <li>b). Only the root node that was a parent of the child node displayed.</li>
</ul>
    <li>2). Start with only root nodes displayed</li>
</ul>
    
<li>I wanted the TreeView to generate an event when a node was clicked</li>
</ul>

So this is the most minimal treeview I could generate.
9/23/2018 - mike richards




