-- RPC for Task Reordering (Same Column)
CREATE OR REPLACE FUNCTION decrement_task_positions(p_column_id UUID, p_start_pos INT, p_end_pos INT)
RETURNS VOID AS $$
BEGIN
  UPDATE tasks
  SET position = position - 1
  WHERE column_id = p_column_id
    AND position BETWEEN p_start_pos AND p_end_pos;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_task_positions(p_column_id UUID, p_start_pos INT, p_end_pos INT)
RETURNS VOID AS $$
BEGIN
  UPDATE tasks
  SET position = position + 1
  WHERE column_id = p_column_id
    AND position BETWEEN p_start_pos AND p_end_pos;
END;
$$ LANGUAGE plpgsql;

-- RPC for Task Moving (Cross Column or remove/insert)
CREATE OR REPLACE FUNCTION decrement_task_positions_from(p_column_id UUID, p_start_pos INT)
RETURNS VOID AS $$
BEGIN
  UPDATE tasks
  SET position = position - 1
  WHERE column_id = p_column_id
    AND position >= p_start_pos;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_task_positions_from(p_column_id UUID, p_start_pos INT)
RETURNS VOID AS $$
BEGIN
  UPDATE tasks
  SET position = position + 1
  WHERE column_id = p_column_id
    AND position >= p_start_pos;
END;
$$ LANGUAGE plpgsql;

-- RPC for Column Reordering
CREATE OR REPLACE FUNCTION decrement_column_positions(p_project_id UUID, p_start_pos INT, p_end_pos INT)
RETURNS VOID AS $$
BEGIN
  UPDATE columns
  SET position = position - 1
  WHERE project_id = p_project_id
    AND position BETWEEN p_start_pos AND p_end_pos;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_column_positions(p_project_id UUID, p_start_pos INT, p_end_pos INT)
RETURNS VOID AS $$
BEGIN
  UPDATE columns
  SET position = position + 1
  WHERE project_id = p_project_id
    AND position BETWEEN p_start_pos AND p_end_pos;
END;
$$ LANGUAGE plpgsql;
