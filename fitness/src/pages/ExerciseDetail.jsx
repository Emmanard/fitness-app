import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import axios from "../api/api";
import axiosoption from "../api/youtube";
import useAxiosFunction from "../hooks/useAxiosQueryFn";
import Detail from "../components/Detail";
import ExerciseVideos from "../components/ExerciseVideos";
import SimilarExercises from "../components/SimilarExercises";
import Loader from "../components/Loader";

const ExerciseDetail = () => {
  const { id } = useParams();
  const { useFetchData } = useAxiosFunction();

  // Primary query for exercise details
  const {
    data: exerciseDetail,
    isLoading: isLoadingExerciseDetail,
    error: exerciseDetailError,
  } = useFetchData(["exerciseDetail", id], {
    axiosInstance: axios,
    url: `/exercises/exercise/${id}`,
  });

  // Log exercise details data for debugging
  useEffect(() => {
    if (exerciseDetail) {
      console.log("Fetched Exercise Details:", exerciseDetail);
    }
  }, [exerciseDetail]);

  // Only proceed with dependent queries if exerciseDetail exists and has required fields
  const shouldFetchDependentData = 
    exerciseDetail && 
    exerciseDetail.name && 
    exerciseDetail.target && 
    exerciseDetail.equipment;

  // Conditional checks for target and equipment data
  const target = exerciseDetail?.target || "";
  const equipment = exerciseDetail?.equipment || "";

  // Exercise videos query
  const {
    data: exerciseVideos,
    isLoading: isLoadingExerciseVideos,
    error: exerciseVideosError,
  } = useFetchData(
    ["exerciseVideos", exerciseDetail?.name],
    {
      axiosInstance: axiosoption,
      url: `/search?query=${encodeURIComponent(exerciseDetail?.name || '')} exercise`,
    },
    {
      enabled: shouldFetchDependentData,
    }
  );

  // Log exercise videos data for debugging
  useEffect(() => {
    if (exerciseVideos) {
      console.log("Fetched Exercise Videos:", exerciseVideos);
    }
  }, [exerciseVideos]);

  // Target muscle exercises query
  const {
    data: targetMuscleExercises,
    isLoading: isLoadingTargetMuscle,
    error: targetMuscleError,
  } = useFetchData(
    ["targetMuscleExercises", target],
    {
      axiosInstance: axios,
      url: target ? `/exercises/target/${encodeURIComponent(target)}` : "", // Skip if target is missing
    },
    {
      enabled: shouldFetchDependentData && target, // Only fetch if target is valid
    }
  );

  // Log target muscle exercises data for debugging
  useEffect(() => {
    if (targetMuscleExercises) {
      console.log("Fetched Target Muscle Exercises:", targetMuscleExercises);
    }
  }, [targetMuscleExercises]);

  // Equipment exercises query
  const {
    data: equipmentExercises,
    isLoading: isLoadingEquipmentExercises,
    error: equipmentError,
  } = useFetchData(
    ["equipmentExercises", equipment],
    {
      axiosInstance: axios,
      url: equipment ? `/exercises/equipment/${encodeURIComponent(equipment)}` : "", // Skip if equipment is missing
    },
    {
      enabled: shouldFetchDependentData && equipment, // Only fetch if equipment is valid
    }
  );

  // Log equipment exercises data for debugging
  useEffect(() => {
    if (equipmentExercises) {
      console.log("Fetched Equipment Exercises:", equipmentExercises);
    }
  }, [equipmentExercises]);

  // Log errors for debugging
  useEffect(() => {
    const errors = {
      exerciseDetail: exerciseDetailError,
      exerciseVideos: exerciseVideosError,
      targetMuscle: targetMuscleError,
      equipment: equipmentError,
    };

    Object.entries(errors).forEach(([key, error]) => {
      if (error) {
        console.error(`Error fetching ${key}:`, error);
      }
    });
  }, [exerciseDetailError, exerciseVideosError, targetMuscleError, equipmentError]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle loading states
  if (isLoadingExerciseDetail) {
    console.log("Loading Exercise Details...");
    return <Loader />;
  }

  // Handle initial data fetch error
  if (exerciseDetailError) {
    console.error("Error loading exercise details:", exerciseDetailError);
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        Error loading exercise details. Please try again later.
      </Box>
    );
  }

  // Handle no data case
  if (!exerciseDetail) {
    console.warn("No exercise data found.");
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        No exercise data found.
      </Box>
    );
  }

  return (
    <Box>
      <Detail exerciseDetail={exerciseDetail} />
      
      {isLoadingExerciseVideos ? (
        <Loader />
      ) : exerciseVideos && exerciseVideos.contents ? (
        <ExerciseVideos 
          exerciseVideos={exerciseVideos.contents} 
          name={exerciseDetail.name} 
        />
      ) : null}
      
      {(isLoadingTargetMuscle || isLoadingEquipmentExercises) ? (
        <Loader />
      ) : (
        <SimilarExercises
          targetMuscleExercises={targetMuscleExercises || []}
          equipmentExercises={equipmentExercises || []}
        />
      )}
    </Box>
  );
};

export default ExerciseDetail;
