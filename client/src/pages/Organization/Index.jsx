import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, CircularProgress, Alert } from "@mui/material";
import OrgTree from "../../components/OrganizationChart/OrganizationTree";
import { apiService, commonService } from "../../services";

const OrganizationTree = () => {

   // const ORGData = [
   //    {
   //       id: 1,
   //       name: "John Doe",
   //       position: "CEO",
   //       parentId: null,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://img.freepik.com/free-photo/young-handsome-arab-man-wearing-blue-tshirt-standing-isolated-white-background-making-fish-face-with-lips-crazy-comical-gesture-funny-expression_839833-4462.jpg",
   //    },
   //    {
   //       id: 2,
   //       name: "Jane Smith",
   //       position: "CTO",
   //       parentId: 1,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://www.pngitem.com/pimgs/m/130-1300380_female-user-image-icon-hd-png-download.png",
   //    },
   //    {
   //       id: 3,
   //       name: "Bob Johnson",
   //       position: "CFO",
   //       parentId: 1,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://i.pinimg.com/originals/83/7e/77/837e7792a9ce436f98295e992a93321a.png",
   //    },
   //    {
   //       id: 4,
   //       name: "Alice Williams",
   //       position: "Developer",
   //       parentId: 2,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg",
   //    },
   //    {
   //       id: 5,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 2,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
   //    },
   //    {
   //       id: 6,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 3,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://p0.pxfuel.com/preview/276/301/198/avatar-people-person-business.jpg",
   //    },
   //    {
   //       id: 7,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 3,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl: "https://cdn-icons-png.flaticon.com/512/560/560175.png",
   //    },
   //    {
   //       id: 8,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 4,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUZr8J_NnQJMD6bl8-AdMIwE0eP_3jOmCv6xL59PRTuwllTH4uiiU-9h0YdR31H2c09jc&usqp=CAU",
   //    },
   //    {
   //       id: 9,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 3,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrTBPxjgQtxbR_H3BQ_QhM0DVz9eaHSoVv-WGiklBOS2X4heHr1WqAawX2RTqv2J2SNI&usqp=CAU",
   //    },
   //    {
   //       id: 10,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 3,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrTBPxjgQtxbR_H3BQ_QhM0DVz9eaHSoVv-WGiklBOS2X4heHr1WqAawX2RTqv2J2SNI&usqp=CAU",
   //    },
   //    {
   //       id: 11,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 3,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrTBPxjgQtxbR_H3BQ_QhM0DVz9eaHSoVv-WGiklBOS2X4heHr1WqAawX2RTqv2J2SNI&usqp=CAU",
   //    },
   //    {
   //       id: 12,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 2,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrTBPxjgQtxbR_H3BQ_QhM0DVz9eaHSoVv-WGiklBOS2X4heHr1WqAawX2RTqv2J2SNI&usqp=CAU",
   //    },
   //    {
   //       id: 13,
   //       name: "Charlie Brown",
   //       position: "Designer",
   //       parentId: 2,
   //       location: "Vadodara",
   //       department: "Development",
   //       imageUrl:
   //          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPrTBPxjgQtxbR_H3BQ_QhM0DVz9eaHSoVv-WGiklBOS2X4heHr1WqAawX2RTqv2J2SNI&usqp=CAU",
   //    },
   // ];

   const [orgTree, setOrgTree] = useState([]); // Stores the organization tree data
   const [orgTreeLoading, setOrgTreeLoading] = useState(false); // Loading state
   const [error, setError] = useState(""); // Stores any API error messages

   useEffect(() => {
      const fetchOrganizationTree = async () => {
         setOrgTreeLoading(true);
         try {
            const response = await apiService.GetAPICall("getOrganizationTree", "");

            if (response?.data) {
               setOrgTree(response.data);
               console.log(response.data);
               
               commonService.resetAPIFlag("getOrganizationTree", false);
            } else {
               console.log("No organization data found");
               setError("No organization data found");
            }
         } catch (err) {
            setError(err.message);
         } finally {
            commonService.resetAPIFlag("getOrganizationTree", false);
            setOrgTreeLoading(false);
         }
      };

      fetchOrganizationTree();
   }, []);

   return (
      <Box
         className="org-section"
         sx={{
            height: "100%",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
         }}
      >
         <Box
            className="org-subsection"
            sx={{
               p: 4,
               backgroundColor: "#fff",
               borderRadius: "8px",
               height: "100%",
               display: "flex",
               flexDirection: "column",
               overflowY: "hidden",
            }}
         >
            {/* Conditional Rendering for Loading, Error, or Organization Tree */}
            {orgTreeLoading ? (
               <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                  <CircularProgress />
               </div>
            ) : error ? (
               <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
               </Alert>
            ) : orgTree.length > 0 ? (
               <OrgTree data={orgTree} />
            ) : (
               "No Data Available"
            )}
         </Box>
      </Box>
   );
};

export default OrganizationTree;
