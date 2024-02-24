import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
}

const Register = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    const mutation = useMutation(apiClient.register, {
        onSuccess: async() => {
            showToast({ message: "Registration Success!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    })
    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <div className="flex flex-col gap-5 md:flex-row">
                <label className="flex-1 text-sm font-bold text-gray-700">
                    First Name
                    <input type="text" className="w-full px-2 py-1 font-normal border rounded" {...register("firstName", { required: "This field is required" })} />
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                <label className="flex-1 text-sm font-bold text-gray-700">
                    Last Name
                    <input type="text" className="w-full px-2 py-1 font-normal border rounded" {...register("lastName", { required: "This field is required" })} />
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>
            <label className="flex-1 text-sm font-bold text-gray-700">
                Email
                <input type="email" className="w-full px-2 py-1 font-normal border rounded" {...register("email", { required: "This field is required" })} />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label className="flex-1 text-sm font-bold text-gray-700">
                Password
                <input type="password" className="w-full px-2 py-1 font-normal border rounded" {...register("password", { required: "This field is required", minLength: { value: 6, message: "Password must be at least 6 character" } })} />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <label className="flex-1 text-sm font-bold text-gray-700">
                Confirm Password
                <input type="password" className="w-full px-2 py-1 font-normal border rounded" {...register("confirmPassword", {
                    validate: (val) => {
                        if (!val) {
                            return "This field is required";
                        } else if (watch("password") !== val) {
                            return "Your password do not match";
                        }
                    }
                })} />
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}
            </label>
            <span>
                <button type="submit" className="p-2 text-xl font-bold text-white bg-blue-600 hover:bg-blue-500">Create Account</button>
            </span>
        </form>
    )
}

export default Register