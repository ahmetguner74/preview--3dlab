
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PanoramaTool from "./PanoramaTool";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            Panorama Yönetimi
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90vw] sm:max-w-[90vw] md:max-w-[75vw]" side="right">
          <SheetHeader>
            <SheetTitle>Panorama Yönetimi</SheetTitle>
            <SheetDescription>
              360° görüntü yükleyin ve sanal tur oluşturun
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <PanoramaTool />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;
