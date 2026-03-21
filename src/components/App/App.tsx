import NoteList from "../NoteList/NoteList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote, createNote } from "../../services/noteService";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";


export default function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchText(value);
    setPage(1);
  }, 1000);

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, searchText],
    queryFn: () => fetchNotes(page, 12, searchText),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });


  const totalPages = data ? data.totalPages : 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={setInputValue} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
      </header>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading notes</p>}

      {data && (
        <>
          <NoteList notes={data.notes} onDelete={(id) => deleteMutation.mutate(id)} />

          {totalPages > 1 && (
            <Pagination
              total={data.totalPages}
              perPage={12}
              page={page}
              onPageChange={setPage}
            />
          )}
        </>
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={(values) => {
              createMutation.mutate(values);
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

    </div>
  );
}