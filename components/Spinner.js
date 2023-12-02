import { Stack, CircularProgress } from "@mui/material";

export default function Spinner({ fullWidth }) {
  if (fullWidth) {
    return (
      <div className="w-full flex justify-center">
        <Stack spacing={2} direction="row">
          <CircularProgress color="secondary" />
        </Stack>
      </div>
    );
  }
  return (
    <div>
      <Stack spacing={2} direction="row">
        <CircularProgress color="secondary" />
      </Stack>
    </div>
  );
}
