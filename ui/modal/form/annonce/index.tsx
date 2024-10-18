"use client";

import React, { useState } from "react"
import { Button } from "@nextui-org/button"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { GalleryIcon } from "@/ui/icons";
import {VideoIcon} from "@/ui/icons";
import { Tabs, Tab } from "@nextui-org/tabs";
import { base64DataToFile } from "@/app/lib/config/func";
import Alert from "../../alert";

export const AddAnnoncesFormModal = ({ id_eglise, handleFindAnnonces }: { id_eglise: number, handleFindAnnonces: () => void }) => {
  const [croppedFileUrl, setCroppedFileUrl] = useState<string>("");
  const [croppedVideosUrl, setCroppedVideosUrl] = useState<any>("");
  const [selected, setSelected] = useState<string | number>("images")
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false)
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    // if (croppedFileUrl || croppedVideosUrl) {
    //   const formData = new FormData();
    //   if (selected === "images") {
    //     const blobImage = base64DataToFile(croppedFileUrl);
    //     formData.append("contente", blobImage);
    //   } else {
    //     formData.append("contente", croppedVideosUrl);
    //   }
    //   setPending(true);
    //   const response = await createAnnonceApi(formData, id_eglise);
    //   setPending(false);
    //   if (response.hasOwnProperty("statusCode") && response.hasOwnProperty("message")) {
    //     setOpenAlert(true);
    //     setAlertTitle("Erreur");
    //     if (typeof response.message === "object") {
    //       let message = '';
    //       response.message.map((item: string) => message += `${item} \n`)
    //       setAlertMsg(message);
    //     } else {
    //       setAlertMsg(response.message);
    //     }
    //   } else {
    //     setOpenAlert(true);
    //     setAlertTitle("Création réussi");
    //     setAlertMsg("La création de l'annonce a réussi.");
    //     handleFindAnnonces();
    //     setOpenModal(false);
    //     setCroppedFileUrl("");
    //     setCroppedVideosUrl("");
    //   }
    // } else {
    //   setOpenAlert(true);
    //   setAlertTitle("Erreur");
    //   setAlertMsg(`Veuillez sélectionner  ${selected === "images" ? "une image" : "une vidéos"}`);
    // }
  };

  return <div>
    <Button variant="flat" size="sm" onClick={() => { setOpenModal(true) }} >
      Ajouter une annonce
    </Button>
    <Modal scrollBehavior="outside" backdrop={"opaque"} size="5xl" isOpen={openModal} onClose={() => { setOpenModal(false) }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter une annonce</ModalHeader>
            <ModalBody>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit()
              }}>

                <div className="flex w-full flex-col justify-center">
                  <div className="flex justify-center">
                    <Tabs
                      aria-label="Options"
                      className="tabs-centered"
                      selectedKey={selected}
                      onSelectionChange={(k) => { setSelected(k) }}
                    >
                      <Tab
                        key="images"
                        title={<div className="flex items-center space-x-2"><p>Image</p><GalleryIcon /></div>
                        }
                      />
                      <Tab
                        key="videos"
                        title={<div className="flex items-center space-x-2"><p>Videos</p><VideoIcon /></div>}
                      />
                    </Tabs>
                  </div>
                  {/* {(selected === "images") ?
                    <CropperImageUI croppedImageUrl={croppedFileUrl} setCroppedImageUrl={setCroppedFileUrl} />
                    :
                    <CropperVideosUI typeFile="videos" file={croppedVideosUrl} setFile={(file) => {setCroppedVideosUrl(file)}} />
                  } */}

                </div>
                <div className="flex justify-center">
                  <Button type="submit" className="bg-primary text-white mt-4" isLoading={pending}>
                    Ajouter
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
      <Alert isOpen={openAlert} onOpen={() => { setOpenAlert(true) }} onClose={() => { setOpenAlert(false) }} alertBody={<p>{alertMsg}</p>} alertTitle={alertTitle} />
    </Modal>
  </div>
}