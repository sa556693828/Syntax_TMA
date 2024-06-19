"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { tableMap } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select()
          .eq("id", 2);
        if (error) {
          res.status(200).json({ code: 500, msg: "server error", data: {} });
        } else {
          res.status(200).json({ code: 200, msg: "success", data: data });
        }
      } catch (e) {
        res.status(200).json({ code: 500, msg: "server error", data: {} });
      }
      break;
    case "POST":
      const { user_id, task_id } = req.body; // 谁 提交 哪个任务
      if (!user_id || !task_id) {
        //判断入参，是否有未填写的参数
        res
          .status(200)
          .json({ code: 400, msg: "params empty error", data: {} });
        return;
      }

      try {
        //查询是否有该任务存在
        const { data: taskData, error } = await supabase
          .from(tableMap.tasks)
          .select()
          .eq("id", task_id);
        if (error) {
          //查询失败，系统错误
          res.status(200).json({ code: 500, msg: "Server error", data: {} });
          return;
        }
        if (taskData.length == 0) {
          //该任务不存在
          res
            .status(200)
            .json({ code: 410, msg: "This task does not exist!", data: {} });
          return;
        }
        //任务存在 查询是否完成足够次数 若今天次数已满 返回错误信息 否则 插入一条数据
        const strDate = new Date().toLocaleDateString();
        const { data: dataTasks, error: errorTasks } = await supabase
          .from(tableMap.user_tasks)
          .select("id")
          .eq("user_id", user_id)
          .eq("insert_date", strDate)
          .eq("task_id", task_id);
        if (dataTasks) {
          if (taskData[0].times_limit > dataTasks.length) {
            //如果 可完成次数 比 已完成次数多 则添加数据
            const { data: dataInsert, error: errorInsert } = await supabase
              .from(tableMap.user_tasks)
              .insert([
                {
                  user_id: user_id,
                  task_id: task_id,
                  insert_date: strDate,
                },
              ])
              .select();
            if (dataInsert) {
              // 如果插入成功，则返回task信息
              res.status(200).json({
                code: 200,
                msg: "Success",
                data: { data: taskData[0] },
              });
            } else {
              res
                .status(200)
                .json({ code: 500, msg: "Server error", data: {} });
            }
          } else {
            res
              .status(200)
              .json({ code: 430, msg: "Times limit error", data: {} });
          }
        } else {
          res.status(200).json({
            code: 500,
            msg: "Server error",
            data: { error: errorTasks },
          });
        }
      } catch (e) {
        res.status(200).json({ code: 500, msg: "server error", data: {} });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(200).json({
        code: 301,
        msg: "ERROR_REQUEST_METHOD",
        data: {},
      });
      break;
  }
}
