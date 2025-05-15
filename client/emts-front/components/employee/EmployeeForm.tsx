// // components/employee/EmployeeForm.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { toast } from "sonner";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Import schema
// import { EmployeeSchema } from "@/lib/schema/employeeSchema";

// type EmployeeFormValues = z.infer<typeof EmployeeSchema>;

// type RoleOption = {
//   id: number;
//   name: string;
// };

// export function EmployeeForm() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [roles, setRoles] = useState<RoleOption[]>([]);
//   const [loadingRoles, setLoadingRoles] = useState(true);

//   // Load roles on component mount
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setRoles(response.data.map((role: any) => ({
//           id: role.id,
//           name: role.name,
//         })));
//       } catch (error) {
//         console.error("Failed to load roles", error);
//         toast.error("🚨 Failed to load roles. Please refresh.");
//       } finally {
//         setLoadingRoles(false);
//       }
//     };

//     fetchRoles();
//   }, []);

//   const form = useForm<EmployeeFormValues>({
//     resolver: zodResolver(EmployeeSchema),
//     defaultValues: {
//       first_name: "",
//       last_name: "",
//       email: "",
//       phone: "",
//       role_id: undefined,  // 👈 Changed to role_id
//       hire_date: "",
//       salary: undefined,
//     },
//   });

//   const onSubmit = async (values: EmployeeFormValues) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("🚨 Please log in to create an employee.");
//       router.push("/login");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/employees/`, values, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("✅ Employee created successfully!");
//       setTimeout(() => {
//         router.push("/employees");
//         router.refresh();
//       }, 1500);
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.detail ||
//         error.message ||
//         "Something went wrong.";

//       toast.error(`❌ ${errorMessage}`);
//       console.error("Failed to create employee", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* First Name */}
//         <FormField
//           control={form.control}
//           name="first_name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>First Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="John" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Last Name */}
//         <FormField
//           control={form.control}
//           name="last_name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Last Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Doe" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Email */}
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="john.doe@example.com" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Phone */}
//         <FormField
//           control={form.control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phone</FormLabel>
//               <FormControl>
//                 <Input placeholder="+1234567890" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Role Dropdown */}
//         <FormField
//           control={form.control}
//           name="role_id"  // 👈 Now using role_id
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Role</FormLabel>
//               <FormControl>
//                 <Select
//                   onValueChange={(value) => field.onChange(Number(value))}
//                   value={field.value ? field.value.toString() : ""}
//                 >
//                   <SelectTrigger disabled={loadingRoles}>
//                     <SelectValue placeholder={loadingRoles ? "Loading roles..." : "Select role"} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {loadingRoles ? (
//                       <div className="p-2 text-sm">Loading...</div>
//                     ) : roles.length === 0 ? (
//                       <div className="p-2 text-sm text-muted-foreground">No roles found</div>
//                     ) : (
//                       roles.map((role) => (
//                         <SelectItem key={role.id} value={role.id.toString()}>
//                           {role.name}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectContent>
//                 </Select>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Hire Date */}
//         <FormField
//           control={form.control}
//           name="hire_date"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Hire Date</FormLabel>
//               <FormControl>
//                 <Input type="date" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Salary */}
//         <FormField
//           control={form.control}
//           name="salary"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Salary</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   placeholder="50000"
//                   value={field.value ?? ""}
//                   onChange={(e) =>
//                     field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value))
//                   }
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Submit Button */}
//         <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
//           {isSubmitting ? (
//             <div className="flex items-center gap-2">
//               <Spinner className="w-4 h-4" />
//               Creating...
//             </div>
//           ) : (
//             "Create Employee"
//           )}
//         </Button>
//       </form>
//     </Form>
//   );
// }

// function Spinner({ className }: { className?: string }) {
//   return (
//     <svg
//       className={`animate-spin h-5 w-5 ${className}`}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <circle
//         className="opacity-25"
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="4"
//         fill="none"
//       ></circle>
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8V2.5"
//       ></path>
//     </svg>
//   );
// }