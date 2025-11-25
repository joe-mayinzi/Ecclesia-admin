"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Divider,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import {
  uploadPanoramaApi,
  getAllPanoramasWithoutPaginationApi,
  deletePanoramaApi,
} from "@/app/lib/actions/panorama/panorama.req";
import { VideoIcon } from "@/ui/icons";
import { GalleryIcon } from "@/ui/icons";

interface UploadPanoramaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export default function UploadPanoramaModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadPanoramaModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [type, setType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [panoramas, setPanoramas] = useState<any[]>([]);
  const [isLoadingPanoramas, setIsLoadingPanoramas] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string | number>>(
    new Set()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    setImagePreviewUrl(null);
    setType("");
    setTitle("");
    setDescription("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, []);

  // Gérer la sélection de fichier
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Vérifier le type de fichier
      const validVideoTypes = [
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
      ];

      if (!validVideoTypes.includes(file.type)) {
        toast.error(
          "Type de fichier non supporté. Veuillez sélectionner une vidéo (MP4, MPEG, MOV, AVI, WEBM)"
        );
        return;
      }

      // Vérifier la taille (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        toast.error(
          "Le fichier est trop volumineux. Taille maximale: 500MB"
        );
        return;
      }

      setSelectedFile(file);

      // Créer l'URL de prévisualisation
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    []
  );

  // Gérer la sélection d'image
  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Vérifier le type de fichier
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!validImageTypes.includes(file.type)) {
        toast.error(
          "Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, WEBP, GIF)"
        );
        return;
      }

      // Vérifier la taille (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(
          "Le fichier image est trop volumineux. Taille maximale: 10MB"
        );
        return;
      }

      setSelectedImage(file);

      // Créer l'URL de prévisualisation
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    },
    []
  );

  // Nettoyer les URLs de prévisualisation
  const cleanupPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
  }, [previewUrl, imagePreviewUrl]);

  // Gérer la fermeture du modal
  const handleClose = useCallback(() => {
    cleanupPreview();
    resetForm();
    onClose();
  }, [cleanupPreview, resetForm, onClose]);

  // Gérer l'upload
  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier vidéo");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Créer le FormData
      const formData = new FormData();
      formData.append("panorama", selectedFile);
      
      // Ajouter l'image si présente
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Ajouter les champs JSON
      if (type) {
        formData.append("type", type);
      }
      if (title.trim()) {
        formData.append("title", title.trim());
      }
      if (description.trim()) {
        formData.append("description", description.trim());
      }

      // Simuler la progression (pour l'UX)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Appel à l'API
      const result = await uploadPanoramaApi(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Vérifier la réponse
      if (result && (result.statusCode >= 400 || result.error)) {
        const errorMessage =
          typeof result.message === "object"
            ? result.message.join(", ")
            : result.message || "Erreur lors de l'upload";
        throw new Error(errorMessage);
      }

      // Succès
      toast.success("Panorama uploadé avec succès !");
      cleanupPreview();
      resetForm();
      
      // Rafraîchir la liste des panoramas
      await loadPanoramas();

      // Callback de succès
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'upload du panorama";
      console.error("Erreur upload panorama:", error);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFile, selectedImage, type, title, description, cleanupPreview, resetForm, onClose, onUploadSuccess]);

  // Charger les panoramas au montage et quand le modal s'ouvre
  const loadPanoramas = useCallback(async () => {
    setIsLoadingPanoramas(true);
    try {
      // La fonction getAllPanoramasWithoutPaginationApi retourne maintenant toujours un tableau normalisé
      const data = await getAllPanoramasWithoutPaginationApi();
      setPanoramas(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors du chargement des panoramas";
      console.error("Erreur chargement panoramas:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoadingPanoramas(false);
    }
  }, []);

  // Charger les panoramas quand le modal s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      loadPanoramas();
    }
  }, [isOpen, loadPanoramas]);

  // Nettoyer les URLs lors du démontage
  React.useEffect(() => {
    return () => {
      cleanupPreview();
    };
  }, [cleanupPreview]);

  // Gérer la suppression d'un panorama
  const handleDelete = useCallback(
    async (id: string | number) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce panorama ?")) {
        return;
      }

      setDeletingIds((prev) => new Set(prev).add(id));
      try {
        await deletePanoramaApi(id);
        toast.success("Panorama supprimé avec succès !");
        // Rafraîchir la liste
        await loadPanoramas();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression du panorama";
        console.error("Erreur suppression panorama:", error);
        toast.error(errorMessage);
      } finally {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    },
    [loadPanoramas]
  );

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <h2 className="text-2xl font-semibold">Uploader un Panorama</h2>
          <p className="text-sm text-default-500 font-normal">
            Téléchargez une vidéo biblique (Panorama)
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Zone de sélection de fichiers */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-default-700">
                  Fichier Panorama (vidéo) <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="panorama-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="panorama-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      selectedFile
                        ? "border-primary bg-primary-50"
                        : "border-default-300 hover:border-default-400 bg-default-50"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <VideoIcon className="text-4xl text-primary" />
                        <span className="text-sm font-medium text-default-700">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-default-500">
                          {formatFileSize(selectedFile.size)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <VideoIcon className="text-4xl text-default-400" />
                        <span className="text-sm font-medium text-default-600">
                          Cliquez pour sélectionner une vidéo
                        </span>
                        <span className="text-xs text-default-500">
                          MP4, MPEG, MOV, AVI, WEBM (max 500MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Aperçu vidéo */}
              {previewUrl && selectedFile && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-default-700">
                    Aperçu Panorama
                  </label>
                  <div className="relative w-full rounded-lg overflow-hidden bg-black">
                    <video
                      src={previewUrl}
                      controls
                      className="w-full max-h-64 object-contain"
                      preload="metadata"
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </div>
                </div>
              )}

              {/* Zone de sélection d'image optionnelle */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-default-700">
                  Image (optionnel)
                </label>
                <div className="relative">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="panorama-image-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="panorama-image-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      selectedImage
                        ? "border-primary bg-primary-50"
                        : "border-default-300 hover:border-default-400 bg-default-50"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {selectedImage ? (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <GalleryIcon className="text-3xl text-primary" />
                        <span className="text-sm font-medium text-default-700">
                          {selectedImage.name}
                        </span>
                        <span className="text-xs text-default-500">
                          {formatFileSize(selectedImage.size)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <GalleryIcon className="text-3xl text-default-400" />
                        <span className="text-sm font-medium text-default-600">
                          Cliquez pour sélectionner une image
                        </span>
                        <span className="text-xs text-default-500">
                          JPEG, PNG, WEBP, GIF (max 10MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Aperçu image */}
              {imagePreviewUrl && selectedImage && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-default-700">
                    Aperçu Image
                  </label>
                  <div className="relative w-full rounded-lg overflow-hidden bg-default-100">
                    <img
                      src={imagePreviewUrl}
                      alt="Aperçu"
                      className="w-full max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* Informations optionnelles */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-default-700 uppercase tracking-wide">
                Informations (optionnel)
              </h3>
              <Select
                label="Type"
                placeholder="Sélectionnez le type de testament"
                selectedKeys={type ? [type] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setType(selected || "");
                }}
                variant="bordered"
                isDisabled={isUploading}
                classNames={{
                  trigger: "h-12",
                  label: "text-sm font-medium",
                }}
              >
                <SelectItem key="New-testament" value="New-testament">
                  Nouveau Testament
                </SelectItem>
                <SelectItem key="Old-testament" value="Old-testament">
                  Ancien Testament
                </SelectItem>
              </Select>
              <Input
                label="Titre"
                placeholder="Entrez un titre pour le panorama"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="bordered"
                isDisabled={isUploading}
                classNames={{
                  input: "text-sm",
                  label: "text-sm font-medium",
                }}
              />
              <Textarea
                label="Description"
                placeholder="Entrez une description pour le panorama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="bordered"
                minRows={3}
                isDisabled={isUploading}
                classNames={{
                  input: "text-sm",
                  label: "text-sm font-medium",
                }}
              />
            </div>

            {/* Barre de progression */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-default-600">
                  <span>Upload en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-default-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Liste des panoramas */}
          <Divider className="my-6" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-default-900">
                Panoramas existants
              </h3>
              <Button
                size="sm"
                variant="light"
                onPress={loadPanoramas}
                isDisabled={isLoadingPanoramas}
              >
                Actualiser
              </Button>
            </div>

            {isLoadingPanoramas ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="md" />
              </div>
            ) : panoramas.length === 0 ? (
              <div className="text-center py-8 text-default-500">
                <VideoIcon className="text-4xl mx-auto mb-2 text-default-300" />
                <p className="text-sm">Aucun panorama pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {panoramas.map((panorama) => {
                  const isDeleting = deletingIds.has(panorama.id);
                  return (
                    <div
                      key={panorama.id}
                      className="flex items-center justify-between p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-default-100 flex items-center justify-center">
                            <VideoIcon className="text-xl text-default-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-default-900 truncate">
                            {panorama.title || panorama.name || "Sans titre"}
                          </h4>
                          {panorama.description && (
                            <p className="text-sm text-default-500 truncate mt-1">
                              {panorama.description}
                            </p>
                          )}
                          {panorama.createdAt && (
                            <p className="text-xs text-default-400 mt-1">
                              {new Date(panorama.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {panorama.videoUrl && (
                          <Button
                            size="sm"
                            variant="light"
                            as="a"
                            href={panorama.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Voir
                          </Button>
                        )}
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => handleDelete(panorama.id)}
                          isLoading={isDeleting}
                          isDisabled={isDeleting}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between pt-4">
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
            className="w-full sm:w-auto"
            isDisabled={isUploading}
          >
            Annuler
          </Button>
          <Button
            color="primary"
            className="text-white w-full sm:w-auto"
            isLoading={isUploading}
            isDisabled={!selectedFile || isUploading}
            onPress={handleUpload}
          >
            {isUploading ? "Upload en cours..." : "Uploader"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

