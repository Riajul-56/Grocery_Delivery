"use client";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { use, useEffect } from "react";

const TrackOrder = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = useParams();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get_order/${orderId}`);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, []);

  return <div className="">page</div>;
};

export default TrackOrder;
