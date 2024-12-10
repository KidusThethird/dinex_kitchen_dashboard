'use client'
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { setAccessToken, getAccessToken, clearAccessToken } from "../../lib/tokenManager";
import { apiUrl } from '@/apiConfig';
import useStore from '../../lib/store';

  
  interface PropsRecived {
    orderId: string;
    
  }
export default function DeliverDialog({orderId}:PropsRecived) {

    const OrderId = orderId;
    const accessToken = getAccessToken();

    const {update_pending_page , increment_for_pending_page } = useStore();


    const updatedData = {
        "OrderStatus" : "delivered",
      };

      const handleUpdate = async () => {
        try {
          console.log("printed");
          const response = await fetch(`${apiUrl}/finance_info/${OrderId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(updatedData),
            credentials: "include",
    
            // Add any necessary headers or authentication tokens
          });
    
          if (response.ok) {
            // File successfully deleted
            console.log("File Updated");
            
             increment_for_pending_page();
            
            toast("Updated!");
           
          } else {
            // File deletion failed
            console.error("Failed to Update file");
          }
        } catch (error) {
          console.error("Error Updating file", error);
        }
      };



  return (
    <div>
      <AlertDialog>
  <AlertDialogTrigger>Delivered</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure to change it to delivered?</AlertDialogTitle>
      <AlertDialogDescription>
        
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>{handleUpdate()}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>
  )
}
