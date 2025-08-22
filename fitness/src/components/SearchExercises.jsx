import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios from "../api/api";
import useAxiosFunction from "../hooks/useAxiosQueryFn";
import HorizontalScrollbar from "./HorizontalScrollBar";
import Loader from "./Loader";  // Assuming you have a loader component

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState("");
  const [bodyParts, setBodyParts] = useState([]);

  const { useFetchData } = useAxiosFunction();

  const configObi = {
    axiosInstance: axios,
    url: "/exercises/bodyPartList",
    
  };

  const {
    data: bodyPartsData,
    isLoading: isLoadingBodyParts,
    error: bodyPartsError,
  } = useFetchData(["bodyParts"], configObi);

  const exercisesConfig = {
    axiosInstance: axios,
    url: "/exercises",
    requestConfig:{
      params: {
        limit: '100',
        offset: '0'
      },
    }
  };

  const {
    data: exercisesData,
    isLoading: isLoadingExercises,
    error: exercisesError,
  } = useFetchData(["exercises"], exercisesConfig);

  useEffect(() => {
    if (bodyPartsData) {
      setBodyParts(["all", ...bodyPartsData]);
    }
  }, [bodyPartsData]);

  useEffect(() => {
    if (exercisesData) {
      setExercises(exercisesData);
    }
  }, [exercisesData, setExercises]);

  const handleSearch = async () => {
    if (search && exercisesData) {
      const searchedExercises = exercisesData.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.target.toLowerCase().includes(search) ||
          item.equipment.toLowerCase().includes(search) ||
          item.bodyPart.toLowerCase().includes(search)
      );

      window.scrollTo({ top: 1800, left: 100, behavior: "smooth" });

      setExercises(searchedExercises);
      setSearch(""); // Reset the search bar
    }
  };

  if (isLoadingBodyParts || isLoadingExercises) {
    return <Loader />; // Assuming you have a Loader component
  }

  if (bodyPartsError || exercisesError) {
    return <Typography>Error: Unable to fetch data</Typography>;
  }

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography fontWeight={700} sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="49px" textAlign="center">
        Awesome Exercises You <br /> Should Know
      </Typography>
      <Box position="relative" mb="72px">
        <TextField
          sx={{
            input: { fontWeight: '700', border: 'none', borderRadius: '4px' },
            width: { lg: '1170px', xs: '350px' },
            backgroundColor: '#fff',
            borderRadius: '40px'
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search Exercises"
          type="text"
        />
        <Button
          sx={{
            bgcolor: '#FF2625',
            color: '#fff',
            textTransform: 'none',
            width: { lg: '173px', xs: '80px' },
            height: '56px',
            position: 'absolute',
            right: '0px',
            fontSize: { lg: '20px', xs: '14px' },
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
      <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
        <HorizontalScrollbar
          data={bodyParts}
          bodyParts={bodyParts}
          setBodyPart={setBodyPart}
          bodyPart={bodyPart}
        />
      </Box>
    </Stack>
  );
};

export default SearchExercises;
