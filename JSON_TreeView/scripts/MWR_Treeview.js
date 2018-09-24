
/*
Copyright (c) 2016 Blue-Mosaic Software, Inc. (Michael W. Richards)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”),
to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//mike's first attempt at a plugin, with boiler-plate taken from:
// see https://msdn.microsoft.com/en-us/magazine/ff706600
// and https://www.smashingmagazine.com/2011/10/essential-jquery-plugin-patterns/

/* This Widget requires three AJAX endpoints, as described below:
    
    SINGLE NODE are returned as JSON objects with three properties:
        {"displayContents":"<the url encoded HTML to be displayed in the node>"
        ,"id":"<the unique ID of the node"
        ,"kids":"<the count of children under the node>"}
    
    THREE AJAX ENDPOINTS REQUIRED:
    nodeRetrevalURI(sParentID) -- returns a JSON array of single nodes that are children of the parent passed in. 
                                    The SINGLE NODE object (the array elements) is described above.
    pathToStartingNodeURI(sChildID) -- A JSON array of NodeID's representing the path up the tree to the top level parent
                                        starting with sChildID in index 0 and ending in the parent node id.
    singleNodeDetailsURI(sNodeID) --  URL to retrieve a single node. Should accept a NodeID and return a Node object in JSON as described above. 

*/

; (function ($, window, document, undefined) {

    $.widget('mwrTreeView.MWR_AjaxTree', {
        options: {
            limitNodesToCurrentParent: false //wether to request all parents, or just the parent of hte currentNodeKey (true for sample trees!!)
            , currentNodeKey: "" //what the tree should be expanded to.  If empty, the first level of the tree is expanded.
            , nodeRetrevalURI: "Default.aspx/RetrieveTreeLevel" //where to get subnodes from.
            , pathToStartingNodeURI: "Default.aspx/RetrievePathToParent"
            , singleNodeDetailsURI: "Default.aspx/RetrieveSingleNode" //just the one node!
        }
        , _create: function () {

            var WholeWidgit = this; //too many this's to keep from going nuts!

            //================================================================================
            //======================= EVENT HANDLERS =========================================
            //================================================================================
            ///these are our events assigned dynamically to the items as they are created.
            $(this.element).on('click', "li.collapsable > ul", function (e) {
                //stopping propogation on the UL keeps clicks lower down
                // in the tree from bubbling up and messing
                //  with the tree expansion/contraction.
                e.stopPropagation();
            })
                           .on('click', "li.collapsable", function () {
                               //  the li.collapsable click function  manages expand/collapse of UL to give appearance of treeview.

                               var $clickedLI = $(this)
                               var iClickedID = WholeWidgit._nodeUniqueID($clickedLI);

                               $clickedLI.toggleClass('c-mwr-tree-plusImage')
                                         .toggleClass('c-mwr-tree-minusImage');

                               if (WholeWidgit._nodeHasChildren($clickedLI))
                                   $clickedLI.children('ul').slideToggle();
                               else
                                   WholeWidgit._retrieveNodeChildren(this, iClickedID);

                               WholeWidgit._SelectNode(this, iClickedID);

                           })
                           .on('click', "li.c-mwr-tree-endNode", function () {

                               var iClickedID = WholeWidgit._nodeUniqueID(this);

                               WholeWidgit._SelectNode(this, iClickedID);
                           });

            ///==========================================================
            ///    THE ENTRY POINT.
            ///==========================================================
            var thisNodeKey = this.options.currentNodeKey;

            //opens up all possible nodes!! (not good for Sample trees)
            // LIKE LOOKING AT "ALL LOCATIONS" IN A FACILITY.
            // where we'd look for items with no parent and display them all.
            if (!this.options.limitNodesToCurrentParent)
                this._retrieveNodeChildren(this.element, "");

            // The path to the current node is always bilt prior to
            //  retrieving the levels, then we turn the level retriever loose on the path.
            if (thisNodeKey && thisNodeKey.length > 0)
                this._buildPathToCurrentNode(thisNodeKey); //START AT SPECIFIC POSITION, SO NEED TO BUILD TREE TO THAT POSITION.


        }
        , selectNode: function (nodeKey) {
            //if another JS app wants to change the selected node in the TV.

            //set this so the build will have it.
            this.options.currentNodeKey = nodeKey;

            //build out the path to the current node, which may use AJAX
            // or it may just expand the existing nodes.
            this._buildPathToCurrentNode(nodeKey);

        }
        , _destroy: function () {
            $(this.element).empty();
        }
        //=====================================================================================================
        //========================= THESE FUNCTIONS MAP THE DOM TO THE TREE! ==================================
        //=================== (so all visual changes to the tree can be done here) ============================
        //=====================================================================================================
        , _addNode: function (oNodeAttr, oParentUL) {

            //if the count of this node's children has been stated we can trim the plus.
            var sClass = oNodeAttr.kids && oNodeAttr.kids > 0
                       ? 'collapsable c-mwr-tree-plusImage'
                       : 'c-mwr-tree-endNode';

            var newNode = $('<li class="' + sClass + '">').append('<span class="c-mwr-tree-collapseHead">' + oNodeAttr['displayContents'] + '</span>')
                                                           .append('<input type="hidden" class="hidIDfield" value="' + oNodeAttr['id'] + '" />')
                                                           .appendTo(oParentUL);

            //IF THIS IS THE NODE THAT IS THE SELECTED NODE, INPUT BY THE USER, TRIGGER A SELECT EVENT
            // AND ADD SPECIAL CSS TO THE NODE!!
            if (this.options.currentNodeKey == oNodeAttr['id'])
                this._SelectNode(newNode, oNodeAttr['id']);

            return newNode;

        }
        , _expandNode: function (oNode) {
            $(oNode).removeClass('c-mwr-tree-plusImage')
                    .addClass('c-mwr-tree-minusImage')
                    .children('ul').show();
        }
        , _CurrentSelectedNode: null
        , _SelectNode: function (oNode, sNodeID) {
            //undo the last selected node display
            if (this._CurrentSelectedNode)
                $(this._CurrentSelectedNode).children('span').removeClass('c-mwr-tree-selected');

            //set the new selected node
            this._CurrentSelectedNode = oNode;

            //color the new selected node
            $(oNode).children('span').addClass('c-mwr-tree-selected');

            // TRIGGER AN OUTSIDE EVENT THAT OTHER JS CAN SINK.
            this._trigger('NodeSelected', null, { node: oNode, id: sNodeID });

        }
        , _nodeHasChildren: function (oLiNode) {
            return $(oLiNode).children('ul').length > 0;
        }
        , _nodeUniqueID: function (oLiNode) {
            return $(oLiNode).children('.hidIDfield').val();
        }
        , _FindNode: function (parentContainer, iThisItemKey) {

            //find within the entire tree, not just direct decendant 7/10/17 ~mwr
            return $(parentContainer).find('.hidIDfield[value="' + iThisItemKey + '"]').parent();
        }
        , _GetChildList: function (parentContainer) {
            return $('<ul>').addClass('c-mwr-tree-innerList').appendTo(parentContainer)
        }
        , _DefineAsEndNode: function (parentContainer) {
            $(parentContainer).removeClass('collapsable c-mwr-tree-plusImage c-mwr-tree-minusImage')
                              .addClass('c-mwr-tree-endNode');
        }
        //=====================================================================================================
        //============================== ADDS DIRECT CHILD NODES UNDER ONE NODE ===============================
        //=====================================================================================================
        , _RenderRetrievedNodes: function (parentContainer, selectedChildNodeStack, JSONresult, textStatus, jqXHR) {

            //THE FIRST TWO PARAMETERS ARE passed in with ".context" of the ajax call!!

            //if we are building out an open tree, this helps us pull the next node.
            var nextChildNodeID = selectedChildNodeStack.length > 0
                                ? selectedChildNodeStack.pop()
                                : null;

            ///if we have no children, then get rid of the whole "collapsable" thing
            if (JSONresult.length == 0)
                this._DefineAsEndNode(parentContainer);

            //====== new UL and add all the children.
            var $childList = this._GetChildList(parentContainer);
            var nextChildNode = null;
            for (var i = 0; i < JSONresult.length; i++) {
                var newNode = this._addNode(JSONresult[i], $childList);

                //in case this is a recursive expansion.
                if (JSONresult[i].id == nextChildNodeID) {

                    this._expandNode(newNode);
                    nextChildNode = newNode;
                }
            }

            //if we are expanding a tree, then trigger recursive AJAX call that will land back here
            // with the next layer down.
            if (nextChildNode)
                this._retrieveNodeChildren(nextChildNode, nextChildNodeID, selectedChildNodeStack);

        }
        //==========================================================================================
        //======================GETS PATH FROM LOADED NODE TO ROOT OF TREE AND BUILDS TREE =========
        //==========================================================================================
        , _BuildTreeFromList: function (JSONresult, textStatus, jqXHR) {

            if (JSONresult.length > 0) {

                //START WITH THE OUTER CONTAINER.
                var parentNode = this.element;
                var iThisItemKey = null;  //corrosponds to the empty parent container.

                //OPEN ANY NODES THAT WERE PREVIOUSLY POPULATED.
                while (this._nodeHasChildren(parentNode)) {
                    //now find next parent, or be done if we are done.
                    if (JSONresult.length == 0) break;

                    var iThisItemKey = JSONresult.pop();
                    var currentNode = this._FindNode(parentNode, iThisItemKey);

                    if (currentNode) {

                        //--open the parent, the top-top level wont' have the +- on it
                        this._expandNode(currentNode);

                        //in the case that the selected node exists in the treeview already
                        // this will trigger it to be selected
                        if (iThisItemKey == this.options.currentNodeKey)
                            this._SelectNode(currentNode, iThisItemKey);

                    }

                    parentNode = currentNode; //I know this is an extra variable, but I was going nuts without this naming

                }

                //this case occurs when we need to add to the tree, recursively.
                if (JSONresult.length > 0) {

                    //special case of a blank tree, with a single node as the top expansion point.
                    if (parentNode === this.element) {
                        //get the single node in a special way, but dump it back to the
                        // recursive node renderer.
                        this._ParentContainer = parentNode;
                        var asChildStack = JSONresult;

                        this.doAJAX({
                              url: this.options.singleNodeDetailsURI
                            , data: "{'sNodeID':'" + JSONresult[JSONresult.length - 1] + "'}"
                            , success: $.proxy(this._RenderRetrievedNodes, null, parentNode, asChildStack)
                        }); 
                    }
                    else {
                        //just build out from the previous built level.
                        this._retrieveNodeChildren(parentNode, iThisItemKey, JSONresult);
                    }

                }

            }

        }
        , _AspNetFilter: function (JSONresult) {
            //THIS DOES TWO THINGS:
            // 1). It strips ASP.Net's outer object, revealing the .d property directly
            // 2). It allows server-side messages, encoded as HTML to be displayed to the user in the web page.

            var sObject;

            //if the server blew up, the response will be an entire HTML
            // error page which we need to display
            if (JSONresult.indexOf('An unhandled exception occured') >= 0) {

                $('html').remove();                 //clear the entire page.
                document.write(JSONresult);         //write out the error page

            }
            else {
                // This boils the response string down
                //  into a proper JavaScript Object().
                sObject = eval('(' + JSONresult + ')');

                // If the response has a ".d" top-level property,
                //  return what's below that instead.
                sObject = sObject.hasOwnProperty('d') ? sObject.d : sObject;

            }

            return sObject;
        }
        , _AJAXError: function (jqXHR, textStatus, errorThrown) {
            alert('AJAX error:\r\n' + errorThrown);
        }
        , _retrieveNodeChildren: function (parentContainer, parentNodeID, selectedChildStack) {


            var childStack = selectedChildStack
                             ? selectedChildStack
                             : new Array();

            //puts all the children under a specifc node using AJAX, specific parent is passed in AJAX
            // Call because the whole thing is asynchronous, so we may be building multiple nodes out of sequence.
            this.doAJAX({
                url: this.options.nodeRetrevalURI
                , data: "{'sParentID':'" + parentNodeID + "'}"
                , success: $.proxy(this._RenderRetrievedNodes, null, parentContainer, childStack)
            });
        }
        , _buildPathToCurrentNode: function (childNodeID) {

            //puts all the children under a specifc node using AJAX
            this.doAJAX({
                url: this.options.pathToStartingNodeURI
                , data: "{'sChildID':'" + childNodeID + "'}"
                , success: this._BuildTreeFromList
            });
        }
        , doAJAX: function (specificOptions) {

            //lot of stuff here that is the same for every ajax call... so write it once.
            $.ajax($.extend(specificOptions
                            , {
                                type: "POST",
                                context: this,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                dataFilter: this._AspNetFilter,
                                error: this._AJAXError,
                                global: false
                            })
                  );

        }


    });
})(jQuery, window, document);

