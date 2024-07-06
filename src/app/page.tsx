"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default () => {
	useEffect(() => {
		redirect("/dashboard/home");
	}, []);

	return <></>;
};