"use client"

import { Button, Modal, ModalContent, ModalHeader, ModalBody, Input, Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react";
import React, { useState } from "react";
import Alert from "../../alert";
import { useAsyncList } from "@react-stately/data";
import { api_url, file_url } from "@/app/lib/request/request";
import { Session } from "next-auth";
import { Users } from "@/app/lib/config/interface";
import { json } from "stream/consumers";
import { SearchIcon } from "@/ui/icons";
import DialogAction from "../../dialog";

type SWCharacter = {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
};

export function AddPersonneMembreFormModal({ handleFindPersonneMemebres, session }: { handleFindPersonneMemebres: () => Promise<void>, session: Session }) {

  const [userSelected, setUserSelected] = useState<Users>()

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const id_eglise = session.user.eglise.id_eglise;

  let list = useAsyncList<Users>({
    async load({ signal, filterText }) {
      let res = await fetch(`${api_url}eglise/findMembreByEgliseId/${id_eglise}`, {
        headers: {
          Authorization: `Bearer ${session?.token.access_token}`,
        },
        signal
      });

      let json = (res.ok && res.status === 200) ? await res.json() : [];

      return {
        items: json
      };
    },
  });

  const handleSubmit = async () => {
    if (userSelected) {
      setLoading(true);
      const create = {}
      setLoading(false);
      // if (create.hasOwnProperty("statusCode") && create.hasOwnProperty("error")) {
      //   setOpenAlert(true);
      //   setAlertTitle("Erreur");
      //   if (typeof create.message === "object") {
      //     let message = '';
      //     create.message.map((item: string) => message += `${item} \n`)
      //     setAlertMsg(message);
      //   } else {
      //     setAlertMsg(create.message);
      //   }
      // } else {
      //   handleFindMemebres();
      // }
    } else {
      setOpenAlert(true);
      setAlertTitle("Champs obligatoires");
      setAlertMsg("Le nom, prenom et le numéro de télephone sont obligatoires");
    }
  }

  const onSelectionChange = (key: string | number | null) => {
    console.log(key);

    if (key !== null) {
      const user = list.items.find(item => item.id === parseInt(`${key}`));
      console.log(user);

      if (user) {
        setOpenModal(() => true);
        setUserSelected(user)
      }
    }

    // setFieldState((prevState) => {
    //   let selectedItem = prevState.items.find((option) => option.value === key);
    //   return {
    //     inputValue: selectedItem?.label || "",
    //     selectedKey: key,
    //     items: animals.filter((item) => startsWith(item.label, selectedItem?.label || "")),
    //   };
    // });
  };

  return <>
    <Autocomplete
      classNames={{
        base: "max-w-[320px]",
        listboxWrapper: "max-h-[320px]",
        selectorButton: "text-default-500"
      }}
      defaultItems={list.items}
      inputValue={list.filterText}
      isLoading={list.isLoading}
      onInputChange={list.setFilterText}
      inputProps={{
        classNames: {
          input: "ml-1",
          inputWrapper: "h-[48px]",
        },
      }}
      listboxProps={{
        hideSelectedIcon: true,
        itemClasses: {
          base: [
            "rounded-medium",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-default-500",
          ],
        },
      }}
      aria-label="Select an employee"
      placeholder="Ajouter du personnel"
      popoverProps={{
        offset: 10,
        classNames: {
          base: "rounded-large",
          content: "p-1 border-small border-default-100 bg-background",
        },
      }}
      startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} />}
      radius="full"
      variant="bordered"
      onSelectionChange={onSelectionChange}
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={`${item.telephone} ${item.nom} ${item.prenom} ${item.username} `}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Avatar alt={`${item.username}`} className="flex-shrink-0" size="sm" src={`${file_url}${item.profil}`} />
              <div className="flex flex-col">
                <span className="text-small">{item.nom} {item.prenom}</span>
                <span className="text-tiny text-default-400">{item.email}</span>
              </div>
            </div>
            <Button
              className="border-small mr-0.5 font-medium shadow-small"
              radius="full"
              size="sm"
              variant="bordered"
              onClick={() => {
                console.log(item.telephone);

              }}
            >
              Ajouter
            </Button>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
    {userSelected &&
      <DialogAction
        isOpen={openModal}
        onOpen={() => { setOpenModal(true) }}
        onClose={() => { setOpenModal(false) }}
        dialogBody={<div className="flex flex-col gap-4 items-center justify-center">
          <p>Voulez-vous vraiment ajouter</p>
           <div className="flex flex-col items-center justify-center">
           <Avatar alt={`${userSelected.username}`} className="flex-shrink-0" size="lg" src={`${file_url}${userSelected.profil}`} />
            <p className="font-bold">{userSelected.nom} {userSelected.prenom}</p>
            <p className="text-tiny text-default-400">@{userSelected.username}</p>
            <p className="text-tiny text-default-400">{userSelected.email}</p>
            <p className="text-tiny text-default-400">{userSelected.telephone}</p>
           </div>
        </div>
        }
        dialogTitle={"Ajouter ce mombre dans l'équipe"}
        action={handleSubmit}
      />
    }
  </>
}

