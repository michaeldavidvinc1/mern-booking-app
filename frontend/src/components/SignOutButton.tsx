import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {

    const {showToast} = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); 
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async() => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Signed Out!", type: "SUCCESS" });
            navigate('/sign-in');
        }, 
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    })

    const handleClick = () => {
        mutation.mutate();
    }
    
    return (
        <button onClick={handleClick} className="px-3 font-bold text-blue-600 bg-white hover:bg-gray-100">Sign Out </button>
    )
}

export default SignOutButton;