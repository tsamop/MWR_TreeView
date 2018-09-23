# MWR_TreeView
A VERY FAST, lightweight, infinitely deep, jQueryUI widget, AJAX TreeView control.

-- I wanted the TreeView to be supported by a single .js and .css file

-- I wanted the TreeView to instantiate like any other jQueryUI widget.

-- I needed a Treeview that would use three AJAX requests to create itself:
    1). Give me a single node by ID.
    2). Give me the path of a node in a tree (path between node and root) by ID.
    3). Give me all the child nodes of a node by ID.

--I wanted all the formatting of the nodes done server-side, and fully customizable.

-- I did not want any recursive queries on the server

-- I wanted the widget to start up in several different ways:
    1). Start from a node ID deep in the tree, and have the treeview render based on that node, with either
      a). All root nodes displayed
      b). Only the root node that was a parent of the child node displayed.
    2). Start with only root nodes displayed
    
-- I wanted the TreeView to generate an event when a node was clicked

So this is the most minimal treeview I could generate.
You really only need the files MWR_Treeview.js and MWR_Treeview.css, the rest of the project is just included as an example 
to help people understand the AJAX/JSON callbacks.



