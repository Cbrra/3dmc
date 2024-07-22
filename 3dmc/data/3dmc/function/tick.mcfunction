execute if score @p timer matches 1.. run scoreboard players add @p timer 1
execute if score @p timer matches 5 run function 3dmc:f/0
execute if score @p timer matches 10 run say Placing chunk 1/2 - DO NOT MOVE
execute if score @p timer matches 15 run function 3dmc:f/1
execute if score @p timer matches 20 run say Placing chunk 2/2 - DO NOT MOVE
execute if score @p timer matches 25 run scoreboard players set @p timer -1