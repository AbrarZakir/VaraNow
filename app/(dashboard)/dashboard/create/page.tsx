import { createListingAction } from "@/app/actions/listing";
import CreateListingForm from "./CreateListingForm";

export default function CreateListingPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Create listing</h1>
      <CreateListingForm />
    </div>
  );
}
