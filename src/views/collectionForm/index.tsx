import { FC } from "react";
import { CollectionForm } from '../../components/Profile/AddCollection';
export const CollectionFormView: FC = ({ }) => {

return (
<div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
            Add Collection
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
            <CollectionForm />
        </div>
      </div>
    </div>
  );
};
