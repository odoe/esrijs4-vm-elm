module Search where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

-- Model
type alias Model =
    { value : String
    , placeholder : String
    , suggestions : List String
    , selectedValue : String
    }

initialModel : Model
initialModel =
  { value = ""
  , placeholder = ""
  , suggestions = []
  , selectedValue = ""
  }

-- UPDATE

type Action = NoOp
            | UpdateModel Model
            | UpdateValue String
            | UpdateSelect String

update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model
    UpdateModel m ->
      m
    UpdateValue value ->
      { model | value = value }
    UpdateSelect value ->
      { model |
        selectedValue = value
      , value = value
      , suggestions = []
      }

-- VIEW

resultList : Signal.Address Action -> String -> Html
resultList address value =
  li
    [
      onClick address (UpdateSelect value)
    ]
    [ text value ]

view : Signal.Address Action -> Model -> Html
view address model =
  let
    elems = List.map (resultList address) model.suggestions
  in
    div
      []
      [
        input
          [ id "search-input"
          , placeholder model.placeholder
          , autofocus True
          , value model.value
          , name "search"
          , on "input" targetValue (Signal.message address << UpdateValue)
          ]
          []
      , ul
          [ class "search-results" ]
          elems
      ]

-- PORTS

port item : Signal Model
port modelChanges : Signal Model
port modelChanges =
  model

-- SIGNALS

inbox : Signal.Mailbox Action
inbox =
  Signal.mailbox NoOp

actions : Signal Action
actions =
  Signal.merge inbox.signal (Signal.map UpdateModel item)

model : Signal Model
model =
  Signal.foldp update initialModel actions

main : Signal Html
main =
  Signal.map (view inbox.address)  model