<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="JSON_TreeView.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="scripts/jquery-3.0.0.min.js"></script>
    <script src="scripts/jquery-ui.min.js"></script>
    <script src="scripts/JSON_Treeview.js"></script>

    <link href="styles/MWR_Treeview.css" rel="stylesheet" />

    <title></title>

    <script>
        function initTreeView() {
            //this keeps clicks lower down in the tree from bubbling up and messing
            // with the tree expansion/contraction.
            $('li.collapsable').children('ul').click(function (e) { e.stopPropagation(); });

            //function to manage expand/collapse of UL to give appearance of treeview.
            $('li.collapsable').click(function () {
                $(this).toggleClass('c-mwr-tree-plusImage')
                       .toggleClass('c-mwr-tree-minusImage')
                       .children('ul').slideToggle();
            });

            //start things collapsed,and remember to start with them having a c-mwr-tree-plusImage class!!
            $('c-mwr-tree-plusImage').children('ul').hide(); //this won't collapse the top level list, because it has a different name.

            //little function to get the ID of a specific LI!
            $("li").mouseenter(function () {
                var liID = $(this).children('.hidIDfield').val();
                $('#txtID').val(liID);
            });

        }


        $(document).ready(function () {
            //this is for the static tree view!!
            initTreeView();

        });


    </script>


</head>
<body>
    <form id="form1" runat="server">
    <div>
        <a href="MWR_Treeview.aspx">DYNAMIC VERSION</a><br /><br />
        ID=<input id="txtID" type="text" />

			        <ul id="staticListSource" class="c-mwr-tree-innerList">
				        <li class="collapsable c-mwr-tree-plusImage">
				            <span class="c-mwr-tree-collapseHead">blue</span>
                            <input type="hidden" class="hidIDfield" value="1" />
					        <ul style="display: none;">
						        <li class="collapsable c-mwr-tree-plusImage">
						            <span class="c-mwr-tree-collapseHead">light blue</span>
                                    <input type="hidden" class="hidIDfield" value="1-1" />
							        <ul style="display: none;">
								        <li class="collapsable c-mwr-tree-plusImage">
								            <span class="c-mwr-tree-collapseHead">light light blue</span>
                                            <input type="hidden" class="hidIDfield" value="1-1-1" />
									        <ul style="display: none;">
										        <li>A
                                                    <input type="hidden" class="hidIDfield" value="1-1-1-1" />
										        </li>
										        <li>B
                                                    <input type="hidden" class="hidIDfield" value="1-1-1-2" /></li>
										        <li>C
                                                    <input type="hidden" class="hidIDfield" value="1-1-1-3" /></li>
									        </ul>
								        </li>
							        </ul>
						        </li>
					        </ul>
				        </li>
                        <li class="collapsable c-mwr-tree-plusImage">
				            <span class="c-mwr-tree-collapseHead">green</span>
                            <input type="hidden" class="hidIDfield" value="2" />
					        <ul style="display: none;">
						        <li class="collapsable c-mwr-tree-plusImage">
						            <span class="c-mwr-tree-collapseHead">light green</span>
                                    <input type="hidden" class="hidIDfield" value="2-1" />
							        <ul style="display: none;">
								        <li class="collapsable c-mwr-tree-plusImage">
								            <span class="c-mwr-tree-collapseHead">light light green</span>
                                            <input type="hidden" class="hidIDfield" value="2-2" />
									        <ul style="display: none;">
										        <li>C
                                            <input type="hidden" class="hidIDfield" value="2-2-1" />  </li>
										        <li>B
                                            <input type="hidden" class="hidIDfield" value="2-2-2" /></li>
										        <li>A
                                            <input type="hidden" class="hidIDfield" value="2-2-3" /></li>
									        </ul>
								        </li>
							        </ul>
						        </li>
					        </ul>
				        </li>
			        </ul>
               
    </div>

    </form>
</body>
</html>
