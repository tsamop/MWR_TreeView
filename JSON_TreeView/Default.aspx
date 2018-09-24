<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="JSON_TreeView.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="scripts/jquery-3.0.0.min.js"></script>
    <script src="scripts/jquery-ui.min.js"></script>
    <script src="scripts/MWR_Treeview.js"></script>

    <link href="styles/MWR_Treeview.css" rel="stylesheet" />

    <title></title>

    <script>

        //so we can widget many times!
        // normally, you would not do this.
        function Cleanup() {
            var tvInstance = $("#myTree").MWR_AjaxTree("instance");
            
            if (tvInstance)
                tvInstance.destroy();
        }


        $(document).ready(function () {
            

            $('#cmdSelect').click(function () {

                var nodeID = $('#txtID').val();

                //get refrence to existing widget
                var tvInstance = $("#myTree").MWR_AjaxTree("instance");

                if (tvInstance) {
                    try {
                        tvInstance.selectNode(nodeID);
                    }
                    catch (e) {
                        alert("Demo has no input validation. enter a number.");
                    }
                }
                else
                    alert("use buttons at top to create a tree first");

            });

            $('#cmdSimple').click(function () {

                Cleanup();

                $("#myTree").MWR_AjaxTree({
                    nodeRetrevalURI: "Default.aspx/RetrieveTreeLevel"
                , pathToStartingNodeURI: "Default.aspx/RetrievePathToParent"
                , singleNodeDetailsURI: "Default.aspx/RetrieveSingleNode"
                });
            });
            


            //example 1: simple AJAX tree,
            // with event handler to show clicked node.
            $('#cmdTopDown').click(function () {

                Cleanup();

                $("#myTree").MWR_AjaxTree({
                    NodeSelected: function (oNode, oData) {
                        $('#txtID').val(oData.id);
                    }
                    , nodeRetrevalURI: "Default.aspx/RetrieveTreeLevel"
                    , pathToStartingNodeURI: "Default.aspx/RetrievePathToParent"
                    , singleNodeDetailsURI: "Default.aspx/RetrieveSingleNode"
            
                });
            });

            //Ajax tree built out to specific node,
            // like a sample tree, where you dont' want to show
            // all possible parents
            $('#cmdShowOne').click(function () {

                Cleanup();

                $("#myTree").MWR_AjaxTree({
                    limitNodesToCurrentParent: true
                    , currentNodeKey: "65"
                    , NodeSelected: function (oNode, oData) {
                        $('#txtID').val(oData.id);
                    }
                    , nodeRetrevalURI: "Default.aspx/RetrieveTreeLevel"
                    , pathToStartingNodeURI: "Default.aspx/RetrievePathToParent"
                    , singleNodeDetailsURI: "Default.aspx/RetrieveSingleNode"
                });
            });

            //AJAX tree built out to a specific, where you DO want
            // to show all possible parents, like a
            // location tree, where you want to start with a specific location.
            $('#cmdShowAll').click(function () {

                Cleanup();

                $("#myTree").MWR_AjaxTree({
                    limitNodesToCurrentParent: false
                    , currentNodeKey: "228"
                    , NodeSelected: function (oNode, oData) {
                        $('#txtID').val(oData.id);
                    }
                    , nodeRetrevalURI: "Default.aspx/RetrieveTreeLevel"
                    , pathToStartingNodeURI: "Default.aspx/RetrievePathToParent"
                    , singleNodeDetailsURI: "Default.aspx/RetrieveSingleNode"
                });
            });



            $('#cmdDispose').click(function () {

                Cleanup();
              
            });




        });


    </script>

</head>
<body>
    <form id="form1" runat="server">
    <div style="padding:40px">

        
        <input id="cmdSimple" type="button" value=" Top-Down Tree, no events" />
        <input id="cmdTopDown" type="button" value="Build Top-Down Tree" />
        <input id="cmdShowOne" type="button" value="Build Bottom-Up Tree" />
        <input id="cmdShowAll" type="button" value="Build Bottom-Up Tree With full Top-level" />
        <input id="cmdDispose" type="button" value="dispose tree" />

        <br /><br />
         SELECTED ID=  <input id="txtID" type="text" />&nbsp; &nbsp; <input id="cmdSelect" type="button" value="<< show this node." />

        <div id="myTree">

        </div>
               
        
    </div>

    </form>
</body>
</html>

