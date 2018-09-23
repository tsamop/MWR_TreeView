using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace JSON_TreeView
{
    public partial class MWR_Treeview : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        /// <summary>
        /// the JSON that describes a single node.
        /// </summary>
        /// <param name="iNodeID">In this example our nodes are integers for simplicity.</param>
        /// <returns></returns>
        private static string WriteOneNode(int iNodeID)
        {
            StringBuilder oSB = new StringBuilder();

            oSB.Append("{\"displayContents\":\"No. ");
            oSB.Append(iNodeID); //these display contents can get as wild as you want.!
            oSB.Append("\",");
            oSB.Append("\"id\":\"");
            oSB.Append(iNodeID);
            oSB.Append("\",");
            oSB.Append("\"kids\":\"");
            oSB.Append(iNodeID < 10000 ? 9 : 0); //nesting stops at 10000, so no kids on any number bigger than 10000 
            oSB.Append("\"}");

            return oSB.ToString();
        }

        /// <summary>
        /// This just gets the details for one node. 
        /// </summary>
        /// <param name="sNodeID"></param>
        /// <returns></returns>
        [WebMethod]
        public static string RetrieveSingleNode(string sNodeID)
        {
            StringBuilder oSB = new StringBuilder("[");

            int iNodeID = int.Parse(sNodeID);

            oSB.Append(WriteOneNode(iNodeID));
            
            oSB.Append("]");

            return oSB.ToString();
        }

        /// <summary>
        /// Get all children at a particular level.
        ///  if the parent is empty, this means to get all the top level items that have no parent.
        /// </summary>
        /// <param name="sParentID">Database Key for the parent to returned samples</param>
        /// <returns></returns>
        [WebMethod]
        public static string RetrieveTreeLevel(string sParentID)
        {
            StringBuilder oSB = new StringBuilder();


            int iParent = sParentID == string.Empty
                        ? 0
                        : int.Parse(sParentID) * 10;

            oSB.Append("[");

            for (int i = 1; i < 10; i++)
            {
                int iThisNodeID = iParent + i;

                oSB.Append(WriteOneNode(iThisNodeID));

                if (i < 9) oSB.Append(",");
            }
            
            oSB.Append("]");

            return oSB.ToString();

        }

        [WebMethod]
        public static string RetrievePathToParent(string sChildID)
        {
            //top level parent is last element in array.
            // will use javascript pop() to retireve elements.
            string sReturn = "[\"";

            while (sChildID.Length > 0)
            {
                sReturn += sChildID;
                sChildID = sChildID.Substring(0, sChildID.Length - 1);
                if (sChildID.Length > 0) sReturn += "\",\"";
            }

            sReturn += "\"]";
            
            return sReturn;
            
        }

    }
}