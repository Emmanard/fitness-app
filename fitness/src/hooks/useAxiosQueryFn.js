import { useMutation, useQuery } from '@tanstack/react-query';

const useAxiosFunction = () => {
    // For GET requests
    const useFetchData = (key, configObj) => {
        const { axiosInstance, url, requestConfig = {} } = configObj;

        return useQuery({
            queryKey: key, // Unique key to identify this query
            queryFn: async () => {
                const response = await axiosInstance.get(url, { ...requestConfig });
                return response.data; // Return only the data
            },
            staleTime: 300000, // Cache duration (optional)
            retry: 0,          // Number of retry attempts for failed requests
            onError: (error) => {
                console.error('Error fetching data:', error.message);
            },
        });
    };

    // For POST/PUT/DELETE requests
    const useMutateData = (configObj) => {
        const { axiosInstance, method, url } = configObj;

        return useMutation({
            mutationFn: async (data) => {
                const response = await axiosInstance[method.toLowerCase()](url, data);
                return response.data; // Return the response data
            },
            onError: (error) => {
                console.error('Error mutating data:', error.message);
            },
            onSuccess: (data) => {
                console.log('Mutation successful:', data);
            },
        });
    };

    return { useFetchData, useMutateData };
};

export default useAxiosFunction;
